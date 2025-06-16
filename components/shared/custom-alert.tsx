import { AlertCircle, LucideIcon } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
type Props = {
  message: string;
  Icon?: LucideIcon;
  variant?: "info" | "warning" | "error" | "success" | "primary";
};
export default function CustomAlert({
  message,
  Icon = AlertCircle,
  variant = "info",
}: Props) {
  const variantStyles = {
    info: "border-blue-500 text-blue-500",
    warning: "border-yellow-500 text-yellow-500",
    error: "border-red-500 text-red-500",
    success: "border-green-500 text-green-500",
    primary: "border-black text-black",
  };

  return (
    <Alert dir="rtl" className={`mt-4 ${variantStyles[variant]}`}>
      <AlertDescription className="flex items-center gap-7 justify-between">
        {message}
        <Icon className="h-4 w-4" />
      </AlertDescription>
    </Alert>
  );
}
