import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/_components/shared/Container";

export const NotificationCardSkeleton = () => (
  <Card className="mb-4 overflow-hidden border-l border-l-primary/10 bg-transparent py-0 shadow-none">
    <CardContent className="p-5">
      <div className="flex items-start gap-4">
        <Skeleton className="w-5 h-5 rounded-md bg-muted/60" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-48 bg-muted/60" />
            <Skeleton className="h-3 w-16 bg-muted/60" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-[90%] bg-muted/60" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const NotificationPageSkeleton = () => (
  <Container>
    {/* Header Skeleton */}
    <header className="flex flex-wrap items-center justify-between mb-8">
      <div>
        <Skeleton className="h-9 w-48 mb-2 bg-muted/60" />
        <Skeleton className="h-4 w-64 bg-muted/60" />
      </div>
      <Skeleton className="h-9 w-32 bg-muted/60 rounded-md" />
    </header>

    {/* Cards Skeleton */}
    <div className="space-y-1">
      {Array.from({ length: 10 }).map((_, i) => (
        <NotificationCardSkeleton key={i} />
      ))}
    </div>

    {/* Footer/Pagination Skeleton */}
    <footer className="flex items-center justify-between mt-10 pt-6 border-t">
      <Skeleton className="h-4 w-32 bg-muted/60" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-9 rounded-md bg-muted/60" />
        <Skeleton className="h-9 w-16 rounded-md bg-muted/60" />
        <Skeleton className="h-9 w-9 rounded-md bg-muted/60" />
      </div>
    </footer>
  </Container>
);
