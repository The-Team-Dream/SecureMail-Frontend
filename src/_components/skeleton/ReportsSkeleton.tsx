import Container from "@/_components/shared/Container";
import { Skeleton } from "@/components/ui/skeleton";

export const ReportsSkeleton = () => {
  return (
    <Container>
      <div className="flex flex-col gap-4 mt-4 animate-pulse">
        {/* Header Skeleton */}
        <Skeleton className="h-9 w-60 rounded-xl mb-4" />

        {/* Hero Overview Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>

        {/* Control Bar Skeleton */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-64 rounded-2xl shrink-0" />
        </div>

        {/* List Items Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </Container>
  );
};
