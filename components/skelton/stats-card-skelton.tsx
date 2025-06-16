import { Skeleton } from "../ui/skeleton";

export default function StatsCardSkelton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {Array(5).map((_) => (
        <Skeleton key={_} className="w-full h-[125px] " />
      ))}
    </div>
  );
}
