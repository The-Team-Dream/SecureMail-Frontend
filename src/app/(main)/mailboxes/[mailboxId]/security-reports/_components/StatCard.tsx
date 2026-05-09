"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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
      text: "text-primary-950",
      icon: "text-primary-400",
    },
    warning: {
      text: "text-warning-700",
      icon: "text-warning-500",
    },
    info: {
      text: "text-secondary-700",
      icon: "text-secondary-500",
    },
    error: {
      text: "text-error-700",
      icon: "text-error-500",
    },
  };

  const currentStyle = styles[type];

  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Card
        className={cn(
          "relative overflow-hidden border rounded-2xl h-full bg-background group",
          currentStyle.text,
        )}
      >
        {/* Background Icon */}
        <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-all duration-500 pointer-events-none">
          <Icon size={140} />
        </div>

        <CardContent className="flex items-start gap-2 relative z-10">
          <div className={cn("p-0", currentStyle.icon)}>
            <Icon />
          </div>
          <div className="flex flex-col gap-2">
            <Text
              size="xs"
              font="bold"
              className="uppercase tracking-widest block mb-0.5"
            >
              {title}
            </Text>
            <Text size="2xl" font="bold" className="leading-tight">
              {value}
            </Text>
            {description && (
              <Text size="xs" font="medium" color="primary-400">
                {description}
              </Text>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
