import Container from "@/_components/shared/Container";
import { Skeleton } from "@/components/ui/skeleton";

export const AnalyticsSkeleton = () => {
  return (
    <Container>
      {/* Title */}
      <Skeleton className="h-10 w-64 mb-6" />

      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-6 rounded-xl bg-ghostBlue p-4"
          >
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-24" />
            <div className="flex flex-col gap-2 mt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-1.5 w-full mt-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 md:mt-12">
        {/* Analytics Chart */}
        <Skeleton className="h-[400px] w-full rounded-xl" />

        {/* Events */}
        <div className="border border-primary-100 rounded-lg p-6">
          <Skeleton className="h-7 w-48 mb-6" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-ghostBlue rounded-lg p-6 flex items-start gap-4"
              >
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};
