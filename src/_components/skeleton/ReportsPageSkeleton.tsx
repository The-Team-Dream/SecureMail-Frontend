import Container from "@/_components/shared/Container";
import { Skeleton } from "@/components/ui/skeleton";

export const ReportsPageSkeleton = () => {
  return (
    <Container>
      <div className="flex flex-col gap-6 animate-pulse">
        {/* Header Skeleton */}
        <Skeleton className="h-7 w-60 rounded-xl mb-2" />

        {/* Hero Overview Cards Skeleton (3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl p-6 flex flex-col gap-3 bg-ghostBlue/50 h-[156px] border border-primary-50/20">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-8 w-12 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>

        {/* List Items Skeleton */}
        <div className="flex flex-col gap-4 mt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl p-6 flex flex-col gap-3 bg-ghostBlue/50 border border-primary-50/20 h-[160px]">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-3 w-12 rounded-md" />
              </div>
              <Skeleton className="h-5 w-48 rounded-md" />
              <Skeleton className="h-4 w-64 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};
