
-- ===================================================
-- 📄 Schema: Credit System for Retailer Evaluation
-- Includes: Tables, Indexes, Trigger Functions
-- ===================================================

-- ========================================
-- 🔹 Table: users (retailers and suppliers)
-- ========================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'retailer', 'supplier')),
  commercial_name TEXT NOT NULL,
  commercial_identity_number TEXT NOT NULL,
  business_type TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone2 TEXT,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ========================================
-- 🔹 Table: contracts (supplier-retailer deals)
-- ========================================
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  retailer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'overdue', 'rejected')),
  due_date DATE,
  paid_date DATE,
	start_dare date,
	end_date date,
	payment_terms INTEGER NOT NULL CHECK (payment_terms IN (15, 30, 45, 60)),
  description TEXT,
  number_of_payments INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ========================================
-- 🔹 Table: payments (scheduled payments)
-- ========================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  amount_due DECIMAL(15,2) NOT NULL,
  amount_paid DECIMAL(15,2) DEFAULT 0 NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT NOT NULL CHECK (status IN ('due', 'paid', 'overdue')),
  payment_verification TEXT DEFAULT 'pending' CHECK (payment_verification IN ('pending', 'verified', 'rejected')),
  payment_method TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ========================================
-- 🔹 Table: credit_info (retailer credit summary)
-- ========================================
CREATE TABLE IF NOT EXISTS public.credit_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  retailer_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total_contracts INTEGER DEFAULT 0,
  active_contracts INTEGER DEFAULT 0,
  total_commitments DECIMAL(15,2) DEFAULT 0,
  paid_amount DECIMAL(15,2) DEFAULT 0,
  overdue_amount DECIMAL(15,2) DEFAULT 0,
  payment_score INTEGER DEFAULT 0 CHECK (payment_score BETWEEN 0 AND 100),
  credit_rating CHAR(1) NOT NULL DEFAULT 'C' CHECK (credit_rating IN ('A','B','C','D','E')),
  risk_level VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (risk_level IN ('very-low','low','medium','high','very-high')),
  last_payment_date DATE,
  average_delay INTEGER DEFAULT 0,
  contract_success_rate INTEGER DEFAULT 0,
  monthly_history JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ========================================
-- 🔹 Trigger function: auto update `updated_at`
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 🔹 Triggers to auto update timestamps
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

-- 🔹 Recommended Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_type ON public.users(user_type);
CREATE INDEX IF NOT EXISTS idx_contracts_retailer ON public.contracts(retailer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_supplier ON public.contracts(supplier_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);
CREATE INDEX IF NOT EXISTS idx_payments_contract ON public.payments(contract_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_credit_info_user ON public.credit_info(retailer_id);
