import { Skeleton } from "@/components/ui/skeleton";

export function AddAccountWizardSkeleton() {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-card relative">
      <div className="flex items-center gap-2.5 px-10 py-5 w-full bg-ghostBlue border-b border-primary-100/80 z-10">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-md" />
      </div>

      <div className="flex flex-col flex-1 w-full mx-auto px-10 max-w-8xl pt-10">
        {/* Progress Bar Skeleton */}
        <div className="flex justify-between items-center w-full max-w-[800px] mx-auto mb-16 relative">
          <Skeleton className="absolute top-5 left-0 w-full h-1 -translate-y-1/2" />
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} className="flex flex-col items-center gap-4 relative z-10">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-16 h-3" />
            </div>
          ))}
        </div>

        <hr className="h-px bg-primary-100 w-full absolute left-0 top-[170px]" />

        {/* Content Skeleton (Provider Grid) */}
        <div className="flex flex-col mb-8 w-full mx-auto flex-1 mt-8 max-w-[560px]">
          <div className="flex flex-col gap-2 mb-8 items-center text-center">
            <Skeleton className="h-8 w-64 rounded-lg" />
            <Skeleton className="h-4 w-80 rounded-md mt-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center w-full py-6 pb-8 relative z-20">
          <Skeleton className="w-[110px] h-[46px] rounded-lg" />
          <Skeleton className="w-[130px] h-[46px] rounded-lg" />
        </div>
      </div>
    </div>
  );
}
