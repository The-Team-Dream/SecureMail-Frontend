"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean;
  disableFill?: boolean;
  size?: number;
  disableGroupHover?: boolean;
}

/**
 * A reusable wrapper for custom SVG icons that handles
 * hover and active states with smooth transitions.
 */
export const CustomIcon = ({
  active,
  disableFill,
  size = 22,
  className,
  children,
  disableGroupHover,
  ...props
}: CustomIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "transition-colors duration-200",
        active
          ? "text-primary"
          : disableGroupHover
            ? "text-primary-600"
            : "text-primary-600 group-hover:text-primary",
        className
      )}
      {...props}
    >
      {children}
    </svg>
  );
};
