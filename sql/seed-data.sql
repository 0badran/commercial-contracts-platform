-- إدراج بيانات تجريبية للمستخدمين
-- ملاحظة: يجب إنشاء هؤلاء المستخدمين في Supabase Auth أولاً
INSERT INTO public.users (
  id,
  email,
  full_name,
  user_type,
  commercial_name,
  commercial_identity_number,
  business_type,
  phone,
  phone2,
  country,
  city
)
values (
  -- Get the corresponding id from auth.users based on email
  (select id from auth.users where email = 'supplier@example.com'),
  'supplier@example.com',
  'Supplier User',
  'supplier',
  'Supplier Co.',
  '1234567890',
  'Wholesale',
  '+201234567890',
  null, -- phone2 is optional
  'Egypt',
  'Cairo'
),
(
  -- Get the corresponding id from auth.users based on email
  (select id from auth.users where email = 'retailer@example.com'),
  'retailer@example.com',
  'retailer User',
  'retailer',
  'retailer Co.',
  '1234567890',
  'Wholesale',
  '+201234567890',
  null, -- phone2 is optional
  'Egypt',
  'Cairo'
);

-- بيانات تجريبية للعقود
INSERT INTO public.contracts (
    id,
    retailer_id,
    supplier_id,
    contract_value,
    duration_months,
    payment_terms,
    status,
    start_date,
    end_date,
    notes
) VALUES 
(
    gen_random_uuid(),
    (SELECT id FROM public.users WHERE user_type = 'retailer' LIMIT 1),
    (SELECT id FROM public.users WHERE user_type = 'supplier' LIMIT 1),
    150000.00,
    12,
    'شهرياً',
    'active',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '12 months',
    'عقد توريد مواد غذائية'
),
(
    gen_random_uuid(),
    (SELECT id FROM public.users WHERE user_type = 'retailer' LIMIT 1),
    (SELECT id FROM public.users WHERE user_type = 'supplier' LIMIT 1),
    75000.00,
    6,
    'كل 30 يوم',
    'pending',
    NULL,
    NULL,
    'عقد توريد مستلزمات مكتبية'
);

-- بيانات تجريبية للمدفوعات
INSERT INTO public.payments (
    contract_id,
    amount,
    due_date,
    paid_date,
    status,
    payment_method,
    notes
) VALUES 
(
    (SELECT id FROM public.contracts WHERE status = 'active' LIMIT 1),
    12500.00,
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE - INTERVAL '28 days',
    'paid',
    'تحويل بنكي',
    'دفعة شهر يناير'
),
(
    (SELECT id FROM public.contracts WHERE status = 'active' LIMIT 1),
    12500.00,
    CURRENT_DATE,
    NULL,
    'pending',
    NULL,
    'دفعة شهر فبراير'
);

-- بيانات تجريبية للتقييم الائتماني
INSERT INTO public.credit_ratings (
    user_id,
    rating,
    score,
    total_contracts,
    total_value,
    on_time_payments,
    late_payments
) VALUES 
(
    (SELECT id FROM public.users WHERE user_type = 'retailer' LIMIT 1),
    'A',
    85,
    5,
    500000.00,
    12,
    1
);

UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
  'id', u.id,
  'email', u.email,
  'full_name', u.full_name,
  'user_type', u.user_type,
  'commercial_name', u.commercial_name,
  'commercial_identity_number', u.commercial_identity_number,
  'business_type', u.business_type,
  'phone', u.phone,
  'phone2', u.phone2,
  'country', u.country,
  'city', u.city,
  'email_verified', true,
  'phone_verified', false
)
FROM public.users u
WHERE u.id = auth.users.id;