"use client";

import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { forwardRef, ElementType } from "react";
import { cn } from "@/lib/utils";
/**
 * 📝 Text Component
 *
 * A flexible typography component built with class-variance-authority (CVA)
 * to handle font weight, size, and color variants بسهولة.
 *
 * 🔧 Props:
 * @param as - HTML tag or React component (default: "p")
 * @param font - controls font weight (default, bold, semiBold, light, etc.)
 * @param size - controls text size (xs → 4xl + custom 32px)
 * @param color - controls text color (primary, secondary, error, warning, info, etc.)
 * @param className - إضافات Tailwind إضافية
 * @param ...props - باقي خصائص HTML عادي
 *
 * 🎨 Variants:
 *
 * Font:
 * - default | black | extraBold | bold | semiBold | medium | light | thin
 *
 * Size:
 * - xs | sm | default | lg | xl | 2xl | 3xl | 32 | 4xl
 *
 * Color:
 * - default | muted | error | warning
 * - primary-* (50 → 900)
 * - secondary-* (50 → 950)
 * - warning-* (50 → 950)
 * - info-* (50 → 950)
 * - error-* (50 → 950)
 *
 * ✨ Features:
 * - Dynamic tag باستخدام `as` (p, span, h1, etc.)
 * - Fully typed variants باستخدام CVA
 * - Easy design system integration
 *
 * 🧪 Examples:
 *
 * Basic:
 * <Text>Hello World</Text>
 *
 * Custom size & weight:
 * <Text size="xl" font="bold">Title</Text>
 *
 * Using different tag:
 * <Text as="h1" size="3xl" font="extraBold">
 *   Heading
 * </Text>
 *
 * Error text:
 * <Text color="error" size="sm">
 *   Something went wrong
 * </Text>
 */
const textVariants = cva("transition-colors", {
  variants: {
    font: {
      default: "font-normal",
      black: "font-black",
      extraBold: "font-extrabold",
      bold: "font-bold",
      semiBold: "font-semibold",
      normal: "font-normal",
      medium: "font-medium",
      light: "font-light",
      thin: "font-thin",
    },

    size: {
      default: "text-base",
      xs: "text-xs",
      sm: "text-sm",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "32": "text-[32px]",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
    },

    color: {
      default: "text-primary-900",
      muted: "text-muted-foreground",
      white: "text-white",
      black: "text-black",
      error: "text-error-500",
      warning: "text-warning-500",

      // ── Primary
      "primary-50": "text-primary-50",
      "primary-100": "text-primary-100",
      "primary-200": "text-primary-200",
      "primary-300": "text-primary-300",
      "primary-400": "text-primary-400",
      "primary-500": "text-primary-500",
      "primary-600": "text-primary-600",
      "primary-700": "text-primary-700",
      "primary-800": "text-primary-800",
      "primary-900": "text-primary-900",
      "primary-950": "text-primary",

      // ── Secondary
      "secondary-50": "text-secondary-50",
      "secondary-100": "text-secondary-100",
      "secondary-200": "text-secondary-200",
      "secondary-300": "text-secondary-300",
      "secondary-400": "text-secondary-400",
      "secondary-500": "text-secondary-500",
      "secondary-600": "text-secondary-600",
      "secondary-700": "text-secondary-700",
      "secondary-800": "text-secondary-800",
      "secondary-900": "text-secondary-900",
      "secondary-950": "text-secondary-950",

      // ── Warning
      "warning-50": "text-warning-50",
      "warning-100": "text-warning-100",
      "warning-200": "text-warning-200",
      "warning-300": "text-warning-300",
      "warning-400": "text-warning-400",
      "warning-500": "text-warning-500",
      "warning-600": "text-warning-600",
      "warning-700": "text-warning-700",
      "warning-800": "text-warning-800",
      "warning-900": "text-warning-900",
      "warning-950": "text-warning-950",
      // ── Info
      "info-50": "text-info-50",
      "info-100": "text-info-100",
      "info-200": "text-info-200",
      "info-300": "text-info-300",
      "info-400": "text-info-400",
      "info-500": "text-info-500",
      "info-600": "text-info-600",
      "info-700": "text-info-700",
      "info-800": "text-info-800",
      "info-900": "text-info-900",
      "info-950": "text-info-950",

      // Error
      "error-50": "text-error-50",
      "error-100": "text-error-100",
      "error-200": "text-error-200",
      "error-300": "text-error-300",
      "error-400": "text-error-400",
      "error-500": "text-error-500",
      "error-600": "text-error-600",
      "error-700": "text-error-700",
      "error-800": "text-error-800",
      "error-900": "text-error-900",
      "error-950": "text-error-950",
    },
  },

  defaultVariants: {
    font: "default",
    size: "default",
    color: "default",
  },
});

interface TextProps
  extends
  Omit<React.HTMLAttributes<HTMLElement>, "color">,
  VariantProps<typeof textVariants> {
  as?: ElementType;
}

const Text = forwardRef<HTMLElement, TextProps>(
  ({ className, font, color, size, as: Component = "p", ...props }, ref) => {
    return (
      <Component
        ref={ref as React.Ref<HTMLElement>}
        className={cn(textVariants({ font, color, size }), className)}
        {...props}
      />
    );
  },
);

Text.displayName = "Text";

export { Text, textVariants };
export type { TextProps };
