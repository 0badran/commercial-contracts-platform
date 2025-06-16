export interface CreditInfo {
  retailerId: number
  totalContracts: number
  activeContracts: number
  totalCommitments: number
  paidAmount: number
  overdueAmount: number
  paymentScore: number // 0-100
  creditRating: "A" | "B" | "C" | "D" | "E"
  riskLevel: "منخفض جداً" | "منخفض" | "متوسط" | "مرتفع" | "مرتفع جداً"
  lastPaymentDate: string
  averagePaymentDelay: number // in days
  contractSuccessRate: number // percentage
  monthlyPaymentHistory: {
    month: string
    paid: number
    due: number
    onTime: boolean
  }[]
}

// دالة حساب التصنيف الائتماني الآلي المحدثة
export function calculateCreditRating(
  paymentScore: number,
  contractSuccessRate: number,
  averageDelay: number,
  totalCommitments: number,
): CreditInfo["creditRating"] {
  let score = 0

  // نقاط السداد (40% من التقييم)
  score += (paymentScore / 100) * 40

  // نقاط نجاح العقود (30% من التقييم)
  score += (contractSuccessRate / 100) * 30

  // نقاط التأخير (20% من التقييم)
  if (averageDelay <= 0) score += 20
  else if (averageDelay <= 5) score += 15
  else if (averageDelay <= 15) score += 10
  else if (averageDelay <= 30) score += 5
  else score += 0

  // نقاط حجم الالتزامات (10% من التقييم)
  if (totalCommitments >= 500000) score += 10
  else if (totalCommitments >= 200000) score += 8
  else if (totalCommitments >= 100000) score += 6
  else if (totalCommitments >= 50000) score += 4
  else score += 2

  // تحديد التصنيف بناءً على النقاط (A-E)
  if (score >= 85) return "A" // ممتاز
  if (score >= 70) return "B" // جيد
  if (score >= 55) return "C" // متوسط
  if (score >= 40) return "D" // مقبول
  return "E" // ضعيف
}

// دالة تحديد مستوى المخاطر المحدثة
export function calculateRiskLevel(creditRating: CreditInfo["creditRating"]): CreditInfo["riskLevel"] {
  switch (creditRating) {
    case "A":
      return "منخفض جداً"
    case "B":
      return "منخفض"
    case "C":
      return "متوسط"
    case "D":
      return "مرتفع"
    case "E":
      return "مرتفع جداً"
    default:
      return "متوسط"
  }
}

// بيانات ائتمانية تجريبية محدثة
export const creditData: CreditInfo[] = [
  {
    retailerId: 1,
    totalContracts: 8,
    activeContracts: 5,
    totalCommitments: 250000,
    paidAmount: 180000,
    overdueAmount: 15000,
    paymentScore: 85,
    creditRating: "A",
    riskLevel: "منخفض جداً",
    lastPaymentDate: "2024-03-15",
    averagePaymentDelay: 3,
    contractSuccessRate: 90,
    monthlyPaymentHistory: [
      { month: "2024-01", paid: 45000, due: 45000, onTime: true },
      { month: "2024-02", paid: 40000, due: 40000, onTime: true },
      { month: "2024-03", paid: 35000, due: 38000, onTime: false },
      { month: "2024-04", paid: 42000, due: 42000, onTime: true },
      { month: "2024-05", paid: 18000, due: 25000, onTime: false },
    ],
  },
  {
    retailerId: 2,
    totalContracts: 12,
    activeContracts: 8,
    totalCommitments: 480000,
    paidAmount: 320000,
    overdueAmount: 45000,
    paymentScore: 72,
    creditRating: "B",
    riskLevel: "منخفض",
    lastPaymentDate: "2024-03-10",
    averagePaymentDelay: 8,
    contractSuccessRate: 75,
    monthlyPaymentHistory: [
      { month: "2024-01", paid: 65000, due: 70000, onTime: false },
      { month: "2024-02", paid: 55000, due: 55000, onTime: true },
      { month: "2024-03", paid: 48000, due: 60000, onTime: false },
      { month: "2024-04", paid: 62000, due: 62000, onTime: true },
      { month: "2024-05", paid: 35000, due: 50000, onTime: false },
    ],
  },
  {
    retailerId: 3,
    totalContracts: 5,
    activeContracts: 3,
    totalCommitments: 120000,
    paidAmount: 95000,
    overdueAmount: 8000,
    paymentScore: 65,
    creditRating: "C",
    riskLevel: "متوسط",
    lastPaymentDate: "2024-03-20",
    averagePaymentDelay: 12,
    contractSuccessRate: 60,
    monthlyPaymentHistory: [
      { month: "2024-01", paid: 25000, due: 25000, onTime: true },
      { month: "2024-02", paid: 20000, due: 22000, onTime: false },
      { month: "2024-03", paid: 18000, due: 20000, onTime: false },
      { month: "2024-04", paid: 22000, due: 22000, onTime: true },
      { month: "2024-05", paid: 10000, due: 15000, onTime: false },
    ],
  },
]

// دالة الحصول على البيانات الائتمانية لتاجر معين
export function getCreditInfo(retailerId: number): CreditInfo | null {
  return creditData.find((credit) => credit.retailerId === retailerId) || null
}

// دالة تحديث التصنيف الائتماني آلياً
export function updateCreditRating(retailerId: number): CreditInfo | null {
  const creditInfo = getCreditInfo(retailerId)
  if (!creditInfo) return null

  const newRating = calculateCreditRating(
    creditInfo.paymentScore,
    creditInfo.contractSuccessRate,
    creditInfo.averagePaymentDelay,
    creditInfo.totalCommitments,
  )

  const newRiskLevel = calculateRiskLevel(newRating)

  // تحديث البيانات
  const updatedCredit = {
    ...creditInfo,
    creditRating: newRating,
    riskLevel: newRiskLevel,
  }

  // في التطبيق الحقيقي، سيتم حفظ هذا في قاعدة البيانات
  const index = creditData.findIndex((credit) => credit.retailerId === retailerId)
  if (index !== -1) {
    creditData[index] = updatedCredit
  }

  return updatedCredit
}
