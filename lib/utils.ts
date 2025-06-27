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

const isFormValidate = (form: object) =>
  Object.values(form).every((value) => value !== "");

const emptyCell = "-";

const isUUID = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
export {
  cn,
  crazyToast,
  getCreditRatingColor,
  translateRiskLevel,
  isFormValidate,
  emptyCell,
  isUUID,
};
