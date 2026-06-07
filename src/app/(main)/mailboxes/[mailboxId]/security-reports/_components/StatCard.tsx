"use client";

import { motion } from "framer-motion";
import { Text } from "@/_components/shared/Text";
import { cn } from "@/lib/utils";
import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ElementType;
  type: "neutral" | "warning" | "info" | "error";
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  type,
}: StatCardProps) {
  const styles = {
    neutral: {
      bg: "bg-primary-50/50",
      border: "border-primary-100/50",
      text: "text-primary-950",
      iconBg: "bg-primary-100/80",
      iconColor: "text-primary-600",
      accent: "bg-primary-500",
    },
    warning: {
      bg: "bg-warning-50/50",
      border: "border-warning-100/50",
      text: "text-warning-800",
      iconBg: "bg-warning-100/80",
      iconColor: "text-warning-600",
      accent: "bg-warning-500",
    },
    info: {
      bg: "bg-secondary-200",
      border: "border-secondary-200/50",
      text: "text-secondary-800",
      iconBg: "bg-secondary-400",
      iconColor: "text-secondary-600",
      accent: "bg-secondary-800",
    },
    error: {
      bg: "bg-error-50/50",
      border: "border-error-100/50",
      text: "text-error-800",
      iconBg: "bg-error-100/80",
      iconColor: "text-error-600",
      accent: "bg-error-500",
    },
  };

  const currentStyle = styles[type];

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <div
        className={cn(
          "relative overflow-hidden border rounded-3xl p-5 h-full transition-all duration-300 backdrop-blur-sm group",
          currentStyle.bg,
          currentStyle.border,
          currentStyle.text,
        )}
      >
        {/* Animated Background Pulse */}
        <div className="absolute inset-0 bg-linear-to-br from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="flex flex-col h-full relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div
              className={cn(
                "p-2.5 rounded-2xl shadow-xs transition-transform duration-500 group-hover:scale-110",
                currentStyle.iconBg,
                currentStyle.iconColor,
              )}
            >
              <Icon size={20} strokeWidth={2.5} />
            </div>
            
            {/* Subtle Progress Dot */}
            <div className="flex gap-1">
               <div className={cn("w-1.5 h-1.5 rounded-full", currentStyle.accent)} />
               <div className={cn("w-1.5 h-1.5 rounded-full opacity-20", currentStyle.accent)} />
               <div className={cn("w-1.5 h-1.5 rounded-full opacity-20", currentStyle.accent)} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Text
              size="xs"
              font="bold"
              className="uppercase tracking-[0.15em] opacity-60 mb-0.5"
            >
              {title}
            </Text>
            <div className="flex items-baseline gap-2">
              <Text size="3xl" font="bold" className="tracking-tight">
                {value}
              </Text>
            </div>
            {description && (
              <Text
                size="xs"
                font="medium"
                className="opacity-50 mt-1.5 leading-relaxed"
              >
                {description}
              </Text>
            )}
          </div>
        </div>

        {/* Decorative Corner Element */}
        <div className={cn(
          "absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700 blur-2xl",
          currentStyle.accent
        )} />
      </div>
    </motion.div>
  );
}
