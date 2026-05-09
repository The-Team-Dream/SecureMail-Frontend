import { Skeleton } from "@/components/ui/skeleton";

export const MailDetailsSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-background p-4 sm:p-8">
      <Skeleton className="mb-6 w-3/4 h-8 bg-primary-50 rounded" />
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="w-12 h-12 rounded-full bg-primary-50 shrink-0" />
        <div className="flex flex-col gap-2">
          <Skeleton className="w-48 h-4 bg-primary-50 rounded" />
          <Skeleton className="w-32 h-3 bg-primary-50 rounded" />
        </div>
      </div>
      <div className="flex-1 border-l-2 border-primary-50 pl-6 ml-6 space-y-4">
        <Skeleton className="w-full h-4 bg-primary-50 rounded" />
        <Skeleton className="w-5/6 h-4 bg-primary-50 rounded" />
        <Skeleton className="w-4/6 h-4 bg-primary-50 rounded" />
        <Skeleton className="w-full h-4 bg-primary-50 rounded" />
        <Skeleton className="w-3/4 h-4 bg-primary-50 rounded" />
      </div>
    </div>
  );
};
