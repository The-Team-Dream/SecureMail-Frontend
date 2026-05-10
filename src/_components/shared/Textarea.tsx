"use client";
import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";
import { forwardRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Text } from "@/_components/shared/Text";
import Error from "./Error";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | undefined;
}

export const errorVariants = {
  initial: { y: -10, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -10, opacity: 0 },
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, required, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-primary-400 mb-1 font-medium">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative w-full">
          <textarea
            {...props}
            ref={ref}
            required={required}
            className={cn(
              "w-full px-4 py-3 border text-primary rounded-xl outline-none focus:border-primary-400 transition duration-500 min-h-[150px] resize-none bg-background/50",
              error
                ? "border-error-500 placeholder:text-error-500/50"
                : "border-primary-100 placeholder:text-primary-400/50",
              className,
            )}
          />
        </div>
        <Error error={error} />
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
