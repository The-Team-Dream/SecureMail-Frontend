import { Skeleton } from "@/components/ui/skeleton";

export function AccountCardSkeleton() {
  return (
    <div className="bg-background border border-primary-100/60 rounded-lg py-6 px-8 flex flex-col gap-8 shadow-[0_4px_16px_rgba(223, 223, 223, 0.5)]">
      {/* Header Section Skeleton */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
          <Skeleton className="w-[46px] h-[46px] rounded-full" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Stats Section Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center flex-1 gap-2">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="w-px h-12 bg-primary-100"></div>
        <div className="flex flex-col items-center flex-1 gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="w-px h-12 bg-primary-100"></div>
        <div className="flex flex-col items-center flex-1 gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>

      {/* Buttons Skeleton */}
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 flex-1 rounded-lg" />
      </div>
    </div>
  );
}
