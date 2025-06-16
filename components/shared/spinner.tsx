interface SpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}
export default function Spinner({ size = "sm" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };
  return (
    <>
      <div
        className={`animate-spin rounded-full border-b-2 border-white mr-2 ${sizeClasses[size]}`}
      />
      <span>{"... "}</span>
    </>
  );
}
