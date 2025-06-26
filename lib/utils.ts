import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function crazyToast(message: string, type?: "success" | "error") {
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

export const getCreditRatingColor = (
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

export const getContractedRetailers = (
  contracts: Database["contract"][],
  users: Database["user"][]
) => {
  const retailerIds = new Set(contracts.map((c) => c.retailer_id));
  return users.filter(
    (u) => u.user_type === "retailer" && retailerIds.has(u.id!)
  );
};
