import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/_components/shared/Container";
import { AccountCardSkeleton } from "./AccountCardSkeleton";

export function ConnectedAccountsSkeleton() {
  return (
    <Container>
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8 w-full mt-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="w-40 h-11 rounded-[12px]" />
      </div>

      {/* Grid Skeleton */}
      <div className="bg-ghostBlue rounded-lg p-2 lg:py-6 lg:px-4 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full">
          {[1, 2, 3, 4].map((i) => (
            <AccountCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </Container>
  );
}
