"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TooltipSide = "top" | "bottom" | "left" | "right";

interface TooltipPosition {
  top: number;
  left: number;
  transformOrigin: string;
  transform: string;
}

function getTooltipPosition(
  rect: DOMRect,
  side: TooltipSide,
  gap = 8,
): TooltipPosition {
  switch (side) {
    case "right":
      return {
        top: rect.top + rect.height / 2,
        left: rect.right + gap,
        transformOrigin: "left center",
        transform: "translateY(-50%)",
      };
    case "left":
      return {
        top: rect.top + rect.height / 2,
        left: rect.left - gap,
        transformOrigin: "right center",
        transform: "translate(-100%, -50%)",
      };
    case "bottom":
      return {
        top: rect.bottom + gap,
        left: rect.left + rect.width / 2,
        transformOrigin: "top center",
        transform: "translateX(-50%)",
      };
    case "top":
    default:
      return {
        top: rect.top - gap,
        left: rect.left + rect.width / 2,
        transformOrigin: "bottom center",
        transform: "translate(-50%, -100%)",
      };
  }
}

const arrowClasses: Record<TooltipSide, string> = {
  right:
    "absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground",
  left: "absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-foreground",
  top: "absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground",
  bottom:
    "absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-foreground",
};

// ─── Tooltip Portal ────────────────────────────────────────────────────────

interface TooltipPortalProps {
  label: string;
  visible: boolean;
  side: TooltipSide;
  anchorRect: DOMRect | null;
}

const TooltipPortal = ({
  label,
  visible,
  side,
  anchorRect,
}: TooltipPortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !visible || !anchorRect) return null;

  const { top, left, transform } = getTooltipPosition(anchorRect, side);

  return createPortal(
    <div
      style={{
        position: "fixed",
        top,
        left,
        transform,
        zIndex: 9999,
        pointerEvents: "none",
      }}
      className="px-2 py-1 bg-foreground text-background text-xs font-medium rounded shadow-xl border border-primary-200 whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-100"
    >
      {label}
      <div className={arrowClasses[side]} />
    </div>,
    document.body,
  );
};

// ─── ActionButton ──────────────────────────────────────────────────────────

export const ActionButton = ({
  icon,
  label,
  onClick,
  className,
  variant = "ghost",
  disabled,
  href,
  tooltipSide = "top",
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
  variant?: "ghost" | "danger";
  disabled?: boolean;
  href?: string;
  tooltipSide?: TooltipSide;
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const showTooltip = useCallback(() => {
    if (triggerRef.current) {
      setAnchorRect(triggerRef.current.getBoundingClientRect());
      setTooltipVisible(true);
    }
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltipVisible(false);
  }, []);

  const buttonClass = cn(
    "rounded-full transition-all",
    variant === "danger"
      ? "text-error-500 hover:bg-error-50 hover:text-error-600"
      : "text-primary-700 hover:bg-primary-50",
    className,
  );

  const sharedEvents = {
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip,
  };

  return (
    <div ref={triggerRef} className="relative inline-flex" {...sharedEvents}>
      {href ? (
        <Link
          href={href}
          aria-label={label}
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-full transition-all",
            variant === "danger"
              ? "text-error-500 hover:bg-error-50 hover:text-error-600"
              : "text-primary-700 hover:bg-primary-50",
            className,
          )}
        >
          {icon}
        </Link>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          className={buttonClass}
          onClick={onClick}
        >
          {icon}
        </Button>
      )}

      <TooltipPortal
        label={label}
        visible={tooltipVisible}
        side={tooltipSide}
        anchorRect={anchorRect}
      />
    </div>
  );
};
