-- 📄 Credit Info & Monthly History SQL Schema & Logic
-- Created: 2025-06-24 17:10:31 UTC

-- 🔄 Function to recalculate credit info metrics for a given retailer
CREATE OR REPLACE FUNCTION recalculate_credit_info(user_id UUID)
RETURNS VOID AS $$
DECLARE
  total_contracts INTEGER;
  active_contracts INTEGER;
  total_commitments NUMERIC;
  paid_amount NUMERIC;
  overdue_amount NUMERIC;
  last_payment DATE;
  avg_delay INTEGER;
  success_rate INTEGER;
  score INTEGER;
  rating CHAR(1);
  risk TEXT;
  monthly JSONB := '[]';
BEGIN
  -- Total number of contracts
  SELECT COUNT(*) INTO total_contracts FROM contracts WHERE retailer_id = user_id;

  -- Number of active contracts
  SELECT COUNT(*) INTO active_contracts FROM contracts WHERE retailer_id = user_id AND status = 'active';

  -- Sum of contract amounts (commitments)
  SELECT COALESCE(SUM(amount), 0) INTO total_commitments FROM contracts WHERE retailer_id = user_id;

  -- Total paid amount
  SELECT COALESCE(SUM(amount_paid), 0) INTO paid_amount
  FROM payments
  WHERE contract_id IN (SELECT id FROM contracts WHERE retailer_id = user_id);

  -- Overdue amounts
  SELECT COALESCE(SUM(amount_due - amount_paid), 0) INTO overdue_amount
  FROM payments
  WHERE contract_id IN (SELECT id FROM contracts WHERE retailer_id = user_id)
    AND status = 'overdue';

  -- Last payment date
  SELECT MAX(paid_date) INTO last_payment
  FROM payments
  WHERE contract_id IN (SELECT id FROM contracts WHERE retailer_id = user_id);

  -- Average delay (in days)
  SELECT ROUND(AVG(GREATEST(paid_date - due_date, 0)))::INTEGER INTO avg_delay
  FROM payments
  WHERE contract_id IN (SELECT id FROM contracts WHERE retailer_id = user_id)
    AND paid_date IS NOT NULL;

  -- Contract success rate
  SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'completed') / GREATEST(COUNT(*),1))::INTEGER
  INTO success_rate
  FROM contracts
  WHERE retailer_id = user_id;

  -- Payment score formula
 score := GREATEST(0, LEAST(100, 100 - COALESCE(avg_delay, 0) * 10 - (CASE WHEN overdue_amount > 0 THEN 20 ELSE 0 END)));


  -- Rating assignment based on score
  rating := CASE
    WHEN score >= 90 THEN 'A'
    WHEN score >= 75 THEN 'B'
    WHEN score >= 60 THEN 'C'
    WHEN score >= 40 THEN 'D'
    ELSE 'E'
  END;

  -- Risk level assignment
  risk := CASE
    WHEN rating = 'A' THEN 'very-low'
    WHEN rating = 'B' THEN 'low'
    WHEN rating = 'C' THEN 'medium'
    WHEN rating = 'D' THEN 'high'
    ELSE 'very-high'
  END;

  -- Build monthly payment history
  SELECT jsonb_agg(jsonb_build_object(
'month', TO_CHAR(due_date, 'FMMonth'),
    'due', amount_due,
    'paid', amount_paid,
    'onTime', (status = 'paid' AND paid_date <= due_date)
  )) INTO monthly
  FROM payments
  WHERE contract_id IN (SELECT id FROM contracts WHERE retailer_id = user_id);

  -- Upsert into credit_info
  INSERT INTO credit_info (
    retailer_id, total_contracts, active_contracts, total_commitments, paid_amount,
    overdue_amount, payment_score, credit_rating, risk_level,
    last_payment_date, average_delay, contract_success_rate, monthly_history
  )
  VALUES (
    user_id, total_contracts, active_contracts, total_commitments, paid_amount,
    overdue_amount, score, rating, risk,
    last_payment, avg_delay, success_rate, COALESCE(monthly, '[]'::jsonb)
  )
  ON CONFLICT (retailer_id)
  DO UPDATE SET
    total_contracts = EXCLUDED.total_contracts,
    active_contracts = EXCLUDED.active_contracts,
    total_commitments = EXCLUDED.total_commitments,
    paid_amount = EXCLUDED.paid_amount,
    overdue_amount = EXCLUDED.overdue_amount,
    payment_score = EXCLUDED.payment_score,
    credit_rating = EXCLUDED.credit_rating,
    risk_level = EXCLUDED.risk_level,
    last_payment_date = EXCLUDED.last_payment_date,
    average_delay = EXCLUDED.average_delay,
    contract_success_rate = EXCLUDED.contract_success_rate,
    monthly_history = EXCLUDED.monthly_history,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 🔁 Trigger function to update credit_info after payments
CREATE OR REPLACE FUNCTION update_credit_info_metrics()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM recalculate_credit_info((SELECT retailer_id FROM contracts WHERE id = NEW.contract_id));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 🔔 Trigger on payments insert/update
CREATE TRIGGER trg_update_credit_info_after_payment
AFTER INSERT OR UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_credit_info_metrics();
