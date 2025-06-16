export interface Payment {
  id: number
  contractId: number
  amount: number
  dueDate: string
  paidDate?: string
  status: "مستحق" | "مدفوع" | "متأخر" | "جزئي"
  paidAmount?: number
  paymentMethod?: string
  notes?: string
}

export interface PaymentSchedule {
  contractId: number
  totalAmount: number
  numberOfPayments: number
  paymentFrequency: "شهري" | "ربع سنوي" | "نصف سنوي" | "سنوي"
  firstPaymentDate: string
}

export const paymentSchedules: PaymentSchedule[] = [
  {
    contractId: 1,
    totalAmount: 50000,
    numberOfPayments: 6,
    paymentFrequency: "شهري",
    firstPaymentDate: "2024-01-15",
  },
  {
    contractId: 2,
    totalAmount: 75000,
    numberOfPayments: 5,
    paymentFrequency: "شهري",
    firstPaymentDate: "2024-02-01",
  },
  {
    contractId: 4,
    totalAmount: 45000,
    numberOfPayments: 3,
    paymentFrequency: "شهري",
    firstPaymentDate: "2024-03-10",
  },
]

export const payments: Payment[] = [
  {
    id: 1,
    contractId: 1,
    amount: 8333,
    dueDate: "2024-01-15",
    paidDate: "2024-01-14",
    status: "مدفوع",
    paidAmount: 8333,
    paymentMethod: "تحويل بنكي",
    notes: "دفعة أولى",
  },
  {
    id: 2,
    contractId: 1,
    amount: 8333,
    dueDate: "2024-02-15",
    paidDate: "2024-02-15",
    status: "مدفوع",
    paidAmount: 8333,
    paymentMethod: "شيك",
  },
  {
    id: 3,
    contractId: 1,
    amount: 8333,
    dueDate: "2024-03-15",
    paidDate: "2024-03-20",
    status: "مدفوع",
    paidAmount: 8333,
    paymentMethod: "تحويل بنكي",
    notes: "دفع متأخر 5 أيام",
  },
  {
    id: 4,
    contractId: 1,
    amount: 8333,
    dueDate: "2024-04-15",
    status: "مستحق",
  },
  {
    id: 5,
    contractId: 2,
    amount: 15000,
    dueDate: "2024-02-01",
    paidDate: "2024-02-01",
    status: "مدفوع",
    paidAmount: 15000,
    paymentMethod: "تحويل بنكي",
  },
  {
    id: 6,
    contractId: 2,
    amount: 15000,
    dueDate: "2024-03-01",
    paidDate: "2024-03-01",
    status: "مدفوع",
    paidAmount: 15000,
    paymentMethod: "تحويل بنكي",
  },
  {
    id: 7,
    contractId: 2,
    amount: 15000,
    dueDate: "2024-04-01",
    status: "مستحق",
  },
  {
    id: 8,
    contractId: 4,
    amount: 15000,
    dueDate: "2024-03-10",
    status: "بانتظار الموافقة",
  },
]
