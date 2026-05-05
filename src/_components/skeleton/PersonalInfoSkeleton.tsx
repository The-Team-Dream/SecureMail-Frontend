import { Skeleton } from "@/components/ui/skeleton";

export const PersonalInfoSkeleton = () => (
  <div className="border border-primary-100 py-4 px-6 md:py-6 md:px-8 rounded-lg animate-pulse">
    {/* Header Section */}
    <div className="flex justify-between items-start mb-10">
      <div className="flex items-center gap-2 md:gap-4">
        <Skeleton className="w-8 h-8 rounded-full bg-primary-100" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-24 bg-primary-100" />
          <Skeleton className="h-3 w-40 bg-primary-100" />
        </div>
      </div>
      <Skeleton className="h-9 w-20 rounded-md bg-primary-100" />
    </div>

    {/* Profile Picture */}
    <div className="mt-4 flex flex-col gap-4 md:flex-row items-start md:items-center justify-between max-w-md">
      <Skeleton className="h-4 w-24 bg-primary-100" />
      <div className="flex items-center gap-6">
        <Skeleton className="w-16 h-16 rounded-full bg-primary-100" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-12 bg-primary-100" />
          <Skeleton className="h-4 w-12 bg-primary-100" />
        </div>
      </div>
    </div>

    {/* Info Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-20 bg-primary-100" />
        <Skeleton className="h-10 w-full rounded-md bg-primary-50" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-20 bg-primary-100" />
        <Skeleton className="h-10 w-full rounded-md bg-primary-50" />
      </div>
    </div>
  </div>
);
