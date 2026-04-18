import Container from "@/_components/shared/Container";
import { Skeleton } from "@/components/ui/skeleton";

export const SettingsSkeleton = () => {
  const renderClosedSection = () => (
    <div className="py-2">
      <div className="flex items-center justify-between py-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
    </div>
  );

  return (
    <Container>
      <div className="py-2">
        <div className="flex items-center justify-between py-4">
          <Skeleton className="h-8 w-56" />
        </div>
        <div className="border border-primary-100 py-4 px-6 md:py-6 md:px-8 rounded-lg mt-2">
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-2 md:gap-4">
              <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-40 md:w-56" />
              </div>
            </div>
            <Skeleton className="h-8 w-20 rounded-md shrink-0" />
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mt-4">
            <Skeleton className="h-4 w-24" />
            <div className="flex items-center gap-8 md:ml-10">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="bg-primary-100 my-4 border-t-0 h-px" />
      {renderClosedSection()}

      <hr className="bg-primary-100 my-4 border-t-0 h-px" />
      {renderClosedSection()}

      <hr className="bg-primary-100 my-4 border-t-0 h-px" />
      {renderClosedSection()}

      <hr className="bg-primary-100 my-4 border-t-0 h-px" />

      {/* Clear Cache Section */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </Container>
  );
};
