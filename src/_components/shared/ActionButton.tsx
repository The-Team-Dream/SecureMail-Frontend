import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ActionButton = ({
  icon,
  label,
  onClick,
  className,
  variant = "ghost",
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  variant?: "ghost" | "danger";
  disabled?: boolean;
}) => (
  <div className="group relative">
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={disabled}
      className={cn(
        "rounded-full transition-all",
        variant === "danger"
          ? "text-error-500 hover:bg-error-50 hover:text-error-600"
          : "text-primary-700 hover:bg-primary-50",
        className,
      )}
      onClick={onClick}
    >
      {icon}
    </Button>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl border border-primary-200">
      {label}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
    </div>
  </div>
);
