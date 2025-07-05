import Printing from "@/components/shared/printing";
import TableSkeleton from "@/components/skeletons/table-skeleton";
import { Suspense } from "react";

export default function PrintingPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <Printing />
    </Suspense>
  );
}
