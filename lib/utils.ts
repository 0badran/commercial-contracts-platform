import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function crazyToast(message: string, type?: "success" | "error") {
  switch (type) {
    case "error":
      toast.error(message);
      return;
    case "success":
      toast.success(message);
      return;
    default:
      toast(message);
      return;
  }
}

const getCreditRatingColor = (
  rating: Database["credit_info"]["credit_rating"]
) => {
  switch (rating) {
    case "A":
      return "bg-green-100 text-green-800";
    case "B":
      return "bg-blue-100 text-blue-800";
    case "C":
      return "bg-yellow-100 text-yellow-800";
    case "D":
      return "bg-orange-100 text-orange-800";
    case "E":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function translateRiskLevel(level: Database["credit_info"]["risk_level"]) {
  switch (level) {
    case "very-low":
      return "منخفض جداً";
    case "low":
      return "منخفض";
    case "medium":
      return "متوسط";
    case "high":
      return "مرتفع";
    case "very-high":
      return "مرتفع جداً";
    default:
      return "غير معروف";
  }
}
function translateContractStatus(status: Database["contract"]["status"]) {
  switch (status) {
    case "active":
      return "نشط";
    case "completed":
      return "مكتمل";
    case "overdue":
      return "متأخر";
    case "pending":
      return "بانتظار الموافقه";
    default:
      return "مرفوض";
  }
}

const isFormValidate = (form: object) =>
  Object.values(form).every((value) => value !== "");

const emptyCell = "-";

const isUUID = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );

const translateRole = (role: Database["user"]["user_type"]) => {
  switch (role) {
    case "admin":
      return "مسئول";
    case "retailer":
      return "التاجر";
    case "supplier":
      return "المورد";
  }
};

function translateMonthToArabic(englishMonth: string) {
  const monthsMap = {
    January: "يناير",
    February: "فبراير",
    March: "مارس",
    April: "أبريل",
    May: "مايو",
    June: "يونيو",
    July: "يوليو",
    August: "أغسطس",
    September: "سبتمبر",
    October: "أكتوبر",
    November: "نوفمبر",
    December: "ديسمبر",
  };

  return (
    monthsMap[englishMonth.trim() as keyof typeof monthsMap] || englishMonth
  );
}
type Props = {
  receivedCommercialName: string;
  name: string;
  role: "retailer" | "supplier";
  imgUrl?: string;
  alt?: string;
};
function requestContractTemplate({
  receivedCommercialName,
  name,
  role,
  imgUrl,
  alt,
}: Props) {
  imgUrl =
    imgUrl || role === "supplier"
      ? "https://raw.githubusercontent.com/0badran/commercial-contracts-platform/main/public/screenshots/rate-dangres.png"
      : "https://raw.githubusercontent.com/0badran/commercial-contracts-platform/main/public/screenshots/payment-history.png";

  alt = alt || role === "supplier" ? "منصة عقود المورد" : "منصة عقود التاجر";

  if (role === "retailer") {
    return `
			<section>
				<h1>تم ارسال عقدك</h1>
				<h3>مرحبا, ${name}</h3>
				<p>
					ستصلك رسالة عند التاكيد من قبل: 
					<strong><i>${receivedCommercialName}</i></strong>
				</p>
				<p>نشكرك للانضمام الي منصتنا</p>
				<img src="${imgUrl}" width="80%" height="300" alt="${alt}" />
			</section>
			<p>.فريق عمل منصة العقود يتمني لك النجاح</p>
		`;
  }

  return `
		<section>
			<h1>طلب تاكيد عقد</h1>
			<h2>مرحبا, ${name}</h2>
			<p>
				تم ارسال عقد اليك من <strong><i>${receivedCommercialName}</i></strong> في انتظار الموافقه.
			</p>
			<p>يمكنك تسجيل الدخول من <a href="${process.env.NEXT_PUBLIC_ENDPOINT}">هنا</a></p>
			<p>نشكرك للانضمام الي منصتنا</p>
			<img src="${imgUrl}" width="80%" height="300" alt="${alt}" />
		</section>
		<p>.فريق عمل منصة العقود يتمني لك النجاح</p>
	`;
}

export {
  cn,
  crazyToast,
  getCreditRatingColor,
  translateRiskLevel,
  isFormValidate,
  emptyCell,
  isUUID,
  translateContractStatus,
  translateRole,
  translateMonthToArabic,
  requestContractTemplate,
};
