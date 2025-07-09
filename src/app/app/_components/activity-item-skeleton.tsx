import { Skeleton } from "@/components/ui/skeleton";

export function ActivityItemSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-background p-3 shadow-sm h-[62px]">
      <Skeleton className="h-5 w-3/4 rounded-md" />

      <Skeleton className="h-9 w-9 rounded-md" />
    </div>
  );
}