import Container from "@/_components/shared/Container";
import { Skeleton } from "@/components/ui/skeleton";

export const MailboxSkeleton = () => {
  return (
    <Container>
      <div className="flex flex-col h-full bg-background">
        <div className="block md:hidden mb-4">
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary-100 pb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 border-b border-primary-100 pb-3 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-md" />
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-primary-100 p-4"
            >
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};
