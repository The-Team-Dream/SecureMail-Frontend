import { Skeleton } from "@/components/ui/skeleton";

export const ChartSkeleton = () => {
  return (
    <div className="h-[450px] w-full bg-ghostBlue p-6 rounded-xl border border-primary-100/20 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
      <Skeleton className="flex-1 w-full rounded-lg" />
      <div className="flex justify-center gap-6">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
};
