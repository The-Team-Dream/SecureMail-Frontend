import Container from "@/_components/shared/Container";
import { Skeleton } from "@/components/ui/skeleton";

export const ReportsSkeleton = () => {
  return (
    <Container>
      <div className="flex flex-col gap-6">
        {/* Header Skeleton */}
        <Skeleton className="h-8 w-64 mb-2" />

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-background border border-primary-100 p-6 rounded-none space-y-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-10" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          ))}
        </div>

        {/* List Items Skeleton */}
        <div className="flex flex-col gap-4 mt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-primary-100 p-5 gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="mt-1">
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};
