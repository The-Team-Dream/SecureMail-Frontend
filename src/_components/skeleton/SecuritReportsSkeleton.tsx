import { Skeleton } from "@/components/ui/skeleton";
import Container from "../shared/Container";

export default function SecurityReportSkeleton() {
  return (
    <Container>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-10 w-64 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-11 w-full rounded-xl" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </Container>
  );
}
