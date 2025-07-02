---------------🔹Start Trigger Functions🔹---------------
-- Start --
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- End --

-- Start
CREATE OR REPLACE FUNCTION calculate_score(p_retailer_id UUID, p_supplier_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_score INTEGER := 0;
    v_payment RECORD;
    v_delay_days INTEGER;
    v_payment_score INTEGER;
BEGIN
    -- نلف على كل دفعة للتاجر مع المورد
    FOR v_payment IN
        SELECT p.*, c.retailer_id, c.supplier_id
        FROM payments p
        JOIN contracts c ON p.contract_id = c.id
        WHERE c.retailer_id = p_retailer_id 
        AND c.supplier_id = p_supplier_id
    LOOP
        -- حساب أيام التأخير
        IF v_payment.paid_date IS NOT NULL THEN
            -- تم الدفع
            v_delay_days := v_payment.paid_date - v_payment.due_date;
            
            IF v_delay_days < 0 THEN
                v_payment_score := 15; -- دفع مبكر
            ELSIF v_delay_days = 0 THEN
                v_payment_score := 10; -- دفع في الموعد
            ELSIF v_delay_days <= 5 THEN
                v_payment_score := -5; -- تأخير بسيط
            ELSIF v_delay_days <= 10 THEN
                v_payment_score := -7; -- تأخير متوسط
            ELSE
                v_payment_score := -15; -- تأخير كبير
            END IF;
        ELSE
            -- لم يتم الدفع
            v_delay_days := CURRENT_DATE - v_payment.due_date;
            
            IF v_delay_days <= 0 THEN
                v_payment_score := 0; -- لسه في الموعد
            ELSIF v_delay_days <= 5 THEN
                v_payment_score := -5; -- متأخر شوية
            ELSIF v_delay_days <= 10 THEN
                v_payment_score := -7; -- متأخر أكتر
            ELSE
                v_payment_score := -15; -- متأخر جداً
            END IF;
        END IF;
        
        -- جمع النقاط
        v_score := v_score + v_payment_score;
    END LOOP;
    
    -- التأكد إن النتيجة بين 0 و 100
    v_score := GREATEST(0, LEAST(100, 50 + v_score)); -- نبدأ من 50 كقاعدة
    
    RETURN v_score;
END;
$$ LANGUAGE plpgsql;
-- End

-- Start
-- دالة تتنادى عند انشاء دفعة
CREATE OR REPLACE FUNCTION on_payment_create()
RETURNS TRIGGER AS $$
BEGIN
    -- تحديث التقييم للتاجر مع المورد
    PERFORM update_credit_info(
        (SELECT retailer_id FROM contracts WHERE id = NEW.contract_id),
        (SELECT supplier_id FROM contracts WHERE id = NEW.contract_id)
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- End

-- Start
-- دالة تشتغل يومياً
CREATE OR REPLACE FUNCTION daily_score_update()
RETURNS void AS $$
DECLARE
    v_contract RECORD;
BEGIN
    -- تحديث كل التقييمات
    FOR v_contract IN
        SELECT DISTINCT c.retailer_id, c.supplier_id
        FROM contracts c
        JOIN payments p ON p.contract_id = c.id
        WHERE p.due_date <= CURRENT_DATE
    LOOP
        PERFORM update_credit_info(v_contract.retailer_id, v_contract.supplier_id);
    END LOOP;
END;
$$ LANGUAGE plpgsql;
-- End

-- Start --
CREATE OR REPLACE FUNCTION update_credit_info(p_retailer_id UUID, p_supplier_id UUID)
RETURNS void AS $$
DECLARE
  v_new_score INTEGER;
  v_active_contracts INTEGER;
	v_total_commitments NUMERIC;
	v_paid_amount NUMERIC;
	v_overdue_amount NUMERIC;
	v_last_payment DATE;
	v_avg_delay INTEGER;
	v_success_rate INTEGER;
	v_rating CHAR(1);
	v_risk TEXT;
	v_monthly JSONB := '[]';
BEGIN
    -- حساب النقاط الجديدة
    v_new_score := calculate_score(p_retailer_id, p_supplier_id);

    -- حساب بيانات الجدول الاخري

    -- Number of active contracts
    SELECT COUNT(*) INTO v_active_contracts 
    FROM contracts 
    WHERE status = 'active' 
    AND retailer_id = p_retailer_id 
    AND supplier_id = p_supplier_id;

    -- Sum of contract amounts (commitments)
    SELECT COALESCE(SUM(amount), 0) INTO v_total_commitments 
    FROM contracts 
    WHERE retailer_id = p_retailer_id 
    AND supplier_id = p_supplier_id;

    -- Total paid amount
    SELECT COALESCE(SUM(amount_paid), 0) INTO v_paid_amount
    FROM payments
    WHERE contract_id IN (
        SELECT id FROM contracts 
        WHERE retailer_id = p_retailer_id 
        AND supplier_id = p_supplier_id
    );

    -- Overdue amounts
    SELECT COALESCE(SUM(amount_due - amount_paid), 0) INTO v_overdue_amount
    FROM payments
    WHERE contract_id IN (
        SELECT id FROM contracts 
        WHERE retailer_id = p_retailer_id 
        AND supplier_id = p_supplier_id
    ) 
    AND status = 'overdue';

    -- Last payment date
    SELECT MAX(paid_date) INTO v_last_payment
    FROM payments
    WHERE contract_id IN (
        SELECT id FROM contracts 
        WHERE retailer_id = p_retailer_id 
        AND supplier_id = p_supplier_id
    );

    -- Average delay (in days)
    SELECT ROUND(AVG(GREATEST(paid_date - due_date, 0)))::INTEGER INTO v_avg_delay
    FROM payments
    WHERE contract_id IN (
        SELECT id FROM contracts 
        WHERE retailer_id = p_retailer_id 
        AND supplier_id = p_supplier_id
    ) 
    AND paid_date IS NOT NULL;

    -- Contract success rate
    SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'completed') / GREATEST(COUNT(*),1))::INTEGER
    INTO v_success_rate
    FROM contracts
    WHERE retailer_id = p_retailer_id 
    AND supplier_id = p_supplier_id;

    -- Rating assignment
    v_rating := CASE
        WHEN v_new_score >= 90 THEN 'A'
        WHEN v_new_score >= 75 THEN 'B'
        WHEN v_new_score >= 60 THEN 'C'
        WHEN v_new_score >= 40 THEN 'D'
        ELSE 'E'
    END;

    -- Risk level assignment
    v_risk := CASE
        WHEN v_rating = 'A' THEN 'very-low'
        WHEN v_rating = 'B' THEN 'low'
        WHEN v_rating = 'C' THEN 'medium'
        WHEN v_rating = 'D' THEN 'high'
        ELSE 'very-high'
    END;
    
    -- Build monthly payment history
    SELECT jsonb_agg(jsonb_build_object(
        'month', TO_CHAR(due_date, 'FMMonth'),
        'due', amount_due,
        'paid', amount_paid,
        'onTime', (status = 'paid' AND paid_date <= due_date)
    )) INTO v_monthly
    FROM payments
    WHERE contract_id IN (
        SELECT id FROM contracts 
        WHERE retailer_id = p_retailer_id 
        AND supplier_id = p_supplier_id
    );

    -- تحديث الجدول
    UPDATE credit_info
    SET 
        active_contracts = v_active_contracts,
        total_commitments = v_total_commitments,
        payment_score = v_new_score,
        paid_amount = v_paid_amount,
        overdue_amount = v_overdue_amount,
        credit_rating = v_rating,
        risk_level = v_risk,
        last_payment_date = v_last_payment,
        average_delay = v_avg_delay,
        contract_success_rate = v_success_rate,
        monthly_history = v_monthly
    WHERE retailer_id = p_retailer_id 
    AND supplier_id = p_supplier_id;
    
    -- لو مافيش سجل، اعمل واحد جديد
    IF NOT FOUND THEN
        INSERT INTO credit_info (
        retailer_id, supplier_id, active_contracts, 
        total_commitments, paid_amount, overdue_amount, payment_score, 
        credit_rating, risk_level, last_payment_date, average_delay, 
        contract_success_rate, monthly_history
        )
        VALUES (
        p_retailer_id, p_supplier_id, v_active_contracts, v_total_commitments, 
        v_paid_amount, v_overdue_amount, v_new_score, v_rating, v_risk,
        v_last_payment, v_avg_delay, v_success_rate, COALESCE(v_monthly, '[]'::jsonb)
        );
    END IF;
END;
$$ LANGUAGE plpgsql;
-- End --

-- Start --
CREATE OR REPLACE FUNCTION set_contract_dates_if_active()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' THEN
    IF NEW.start_date IS NULL OR TG_OP = 'INSERT' THEN
      NEW.start_date := NOW()::DATE;
      NEW.due_date := NEW.start_date + (NEW.payment_terms * INTERVAL '1 day');
      NEW.end_date := NEW.start_date + (NEW.number_of_payments * NEW.payment_terms * INTERVAL '1 day');
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- End --

-- Start
CREATE OR REPLACE FUNCTION update_credit_info_after_contract_change()
RETURNS TRIGGER AS $$
DECLARE
  v_active_contracts INTEGER;
  v_total_commitments DECIMAL(15,2);
BEGIN
  SELECT COUNT(*), COALESCE(SUM(amount), 0)
  INTO v_active_contracts, v_total_commitments
  FROM contracts
  WHERE supplier_id = NEW.supplier_id
    AND retailer_id = NEW.retailer_id
    AND status = 'active';

  INSERT INTO public.credit_info (retailer_id, supplier_id, active_contracts, total_commitments)
  VALUES (NEW.retailer_id, NEW.supplier_id, v_active_contracts, v_total_commitments)
  ON CONFLICT (retailer_id, supplier_id)
  DO UPDATE SET
    active_contracts = EXCLUDED.active_contracts,
    total_commitments = EXCLUDED.total_commitments;
	RETURN NULL;
END
$$ LANGUAGE plpgsql;
-- End
---------------🔹End Trigger Functions🔹---------------

---------------🔹Start Triggers🔹---------------
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at
BEFORE UPDATE ON public.contracts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_info_updated_at
BEFORE UPDATE ON public.credit_info
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_set_contract_dates_if_active
BEFORE UPDATE ON contracts
FOR EACH ROW
EXECUTE FUNCTION set_contract_dates_if_active();

CREATE TRIGGER trg_update_credit_info_after_contract_change
AFTER UPDATE ON contracts
FOR EACH ROW
WHEN (NEW.status = 'active')
EXECUTE FUNCTION update_credit_info_after_contract_change();
---------------🔹End Triggers🔹---------------