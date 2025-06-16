type UserType = "supplier" | "retailer" | "admin";

type ContractStatus =
  | "pending"
  | "active"
  | "completed"
  | "cancelled"
  | "rejected";

interface Database {
  user: {
    id: string;
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
  };
  contract: {
    id?: string;
    supplier_id: string;
    amount: number;
    start_date: string;
    end_date: string;
    payment_terms: string;
    description?: string | null;
    number_of_payments: number;
    retailer_id: string;
    status?: ContractStatus;
    created_at?: string;
    updated_at?: string;
  };
  payment: {
    id?: string;
    user_id: string;
    contract_id: string;
    amount: number;
    paid_amount?: number | null;
    due_date: string;
    paid_date?: string | null;
    payment_method?: string | null;
    status?: "pending" | "paid" | "overdue" | "due";
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
  };
}
