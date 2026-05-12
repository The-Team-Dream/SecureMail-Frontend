import Container from "@/_components/shared/Container";
import { Skeleton } from "@/components/ui/skeleton";

export const ReportsSkeleton = () => {
  return (
    <Container>
      <div className="flex flex-col gap-10 mt-4">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
             <Skeleton className="h-4 w-32 rounded-full" />
             <Skeleton className="h-12 w-80 rounded-2xl" />
             <Skeleton className="h-5 w-64 rounded-full" />
          </div>
          <Skeleton className="h-12 w-48 rounded-2xl" />
        </div>

        {/* Hero Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           <Skeleton className="lg:col-span-5 h-[340px] rounded-[2.5rem]" />
           <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-[160px] rounded-3xl" />
              ))}
           </div>
        </div>

        {/* Search Bar Skeleton */}
        <Skeleton className="h-14 w-full rounded-2xl" />

        {/* List Items Skeleton */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[100px] w-full rounded-3xl" />
          ))}
        </div>
      </div>
    </Container>
  );
};
