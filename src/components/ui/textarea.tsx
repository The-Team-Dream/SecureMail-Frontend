import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-[220px] resize-none border border-primary-100 rounded-lg focus-visible:-primary-200 p-4 text-sm flex field-sizing-content  w-full bg-transparent px-3 py-2  shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-px focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm transition-all duration-300",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
