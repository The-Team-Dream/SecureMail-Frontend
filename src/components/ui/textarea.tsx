import * as React from "react";

import { cn } from "@/lib/utils";

import Error from "@/_components/shared/Error";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  error?: string | undefined;
}

function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      <textarea
        data-slot="textarea"
        className={cn(
          "min-h-[220px] resize-none border rounded-lg focus-visible:-primary-200 p-4 text-sm flex field-sizing-content w-full bg-transparent px-3 py-2 shadow-xs outline-none focus-visible:border-ring focus-visible:ring-px focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-300",
          error
            ? "border-error-500 placeholder:text-error-500 focus-visible:border-error-500"
            : "border-primary-100 placeholder:text-muted-foreground focus-visible:border-primary-200",
          className,
        )}
        {...props}
      />
      <Error error={error} />
    </div>
  );
}

export { Textarea };
