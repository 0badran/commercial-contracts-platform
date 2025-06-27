type UserType = "supplier" | "retailer" | "admin";

type ContractStatus =
  | "pending"
  | "active"
  | "completed"
  | "overdue"
  | "rejected";

type PaymentStatus = "due" | "paid" | "overdue";

interface Database {
  user: {
    id?: string; // UUID DEFAULT gen_random_uuid()
    email: string;
    full_name: string;
    user_type: UserType;
    commercial_name: string;
    commercial_identity_number: string;
    business_type: string;
    phone: string;
    phone2?: string | null;
    country: string;
    city: string;
    created_at?: string; // DEFAULT NOW()
    updated_at?: string; // DEFAULT NOW()
  };

  contract: {
    id?: string; // UUID DEFAULT gen_random_uuid()
    supplier_id: string;
    retailer_id: string;
    amount: number;
    status?: ContractStatus; // DEFAULT 'pending'
    payment_terms: 15 | 30 | 45 | 60;
    description?: string | null;
    number_of_payments: number;
    start_date?: string | null;
    end_date?: string | null;
    due_date?: string;
    paid_date?: string | null;
    created_at?: string;
    updated_at?: string;
  };

  payment: {
    id?: string; // UUID DEFAULT gen_random_uuid()
    contract_id: string;
    amount_due: number;
    amount_paid?: number | null; // DEFAULT 0
    due_date: string;
    paid_date?: string | null;
    status?: PaymentStatus; // DEFAULT 'due'
    payment_method?: string | null;
    payment_verification?: "pending" | "verified" | "rejected";
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
  };

  credit_info: {
    id?: string; // UUID DEFAULT gen_random_uuid()
    retailer_id: string;
    total_contracts?: number;
    active_contracts?: number;
    total_commitments?: number;
    paid_amount?: number;
    overdue_amount?: number;
    payment_score?: number;
    credit_rating?: "A" | "B" | "C" | "D" | "E"; // DEFAULT 'C'
    risk_level?: "very-low" | "low" | "medium" | "high" | "very-high"; // DEFAULT 'medium'
    last_payment_date?: string;
    average_delay?: number;
    contract_success_rate?: number;
    monthly_history?: {
      month: string;
      due: number;
      paid: number;
      onTime: boolean;
    }[]; // JSONB
    created_at?: string;
    updated_at?: string;
  };
}
