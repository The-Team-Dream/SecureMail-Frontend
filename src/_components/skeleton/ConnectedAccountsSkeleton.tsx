import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/_components/shared/Container";
import { AccountCardSkeleton } from "./AccountCardSkeleton";

export function ConnectedAccountsSkeleton() {
  return (
    <Container>
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
