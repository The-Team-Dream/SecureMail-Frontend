import { Skeleton } from "@/components/ui/skeleton";

export const RecentSecurityEventsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 p-6 bg-background border border-primary-100 rounded-lg h-full animate-pulse">
      <Skeleton className="h-6 w-48 mb-4" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-ghostBlue/50">
          <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
};
