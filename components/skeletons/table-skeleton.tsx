import { Skeleton } from "../ui/skeleton";

export default function TableSkeleton() {
  return (
    <div className="w-full relative space-y-3 rounded p-4">
      <Skeleton className="size-full inset-0 absolute" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="w-full bg-white/50 h-10" />
      ))}
    </div>
  );
}
