"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean;
  size?: number;
}

/**
 * A reusable wrapper for custom SVG icons that handles
 * hover and active states with smooth transitions.
 */
export const CustomIcon = ({
  active,
  size = 22,
  className,
  children,
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
        active ? "text-primary" : "text-primary-600 group-hover:text-600",
        className
      )}
      {...props}
    >
      {children}
    </svg>
  );
};
