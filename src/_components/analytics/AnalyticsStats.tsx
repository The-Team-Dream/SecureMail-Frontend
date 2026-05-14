"use client";
import { motion } from "framer-motion";
import { AnalyticsOverview } from "@/APIs/types/Analytics";
import { Text } from "@/_components/shared/Text";
import { cn } from "@/lib/utils";
import {
  Mail,
  Shield,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { StatsSkeleton } from "../skeleton/StatsSkeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100 },
  },
};

interface AnalyticsStatsProps {
  overview?: AnalyticsOverview;
  isLoading?: boolean;
}

export const AnalyticsStats = ({
  overview,
  isLoading,
}: AnalyticsStatsProps) => {
  if (isLoading) {
    return <StatsSkeleton />;
  }

  const totalThreats =
    (overview?.totalPhishingDetected || 0) + (overview?.totalSpamDetected || 0);

  const statCards = [
    {
      title: "Total Threats Blocked",
      value: totalThreats,
      badge: {
        text: "14%",
        type: "increase",
        description: "Comparison vs previous 30 days",
      },
      icon: Shield,
    },
    {
      title: "Critical Alerts",
      value: overview?.totalPhishingDetected,
      badge: {
        text: "14%",
        type: "decrease",
        description: "Active incidents requiring attention",
      },
      icon: ShieldAlert,
    },
    {
      id: "health",
      title: "System Health",
      value: "99.9%",
      status: "Stable",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8"
    >
      {statCards.map((card, index) => (
        <motion.div
          variants={itemVariants}
          key={index}
          className="flex flex-col justify-between gap-2 rounded-2xl bg-ghostBlue p-6 transition-all hover:shadow-sm border border-primary-100/20 relative overflow-hidden group"
        >
          {card.id === "health" ? (
            <div className="flex flex-col h-full justify-between gap-2">
              <div className="space-y-3">
                <Text color="primary-800">{card.title}</Text>

                <Text size={"4xl"} font={"bold"}>
                  {card.value}
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text color={"secondary-800"} size={"lg"} font={"medium"}>
                  {card.status}
                </Text>
                <div className="w-full h-[3px] bg-secondary-800 rounded-full" />
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <Text>{card.title}</Text>

                <Text size={"4xl"} font={"bold"}>
                  {card.value}
                </Text>
              </div>

              <div className="space-y-3">
                {card.badge ? (
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium",
                        card.badge.type === "increase"
                          ? "bg-secondary-200 text-secondary-900"
                          : "bg-error-50 text-error-500",
                      )}
                    >
                      {card.badge.type === "increase" ? (
                        <ArrowUpRight size={12} className="stroke-[3px]" />
                      ) : (
                        <ArrowDownRight size={12} className="stroke-[3px]" />
                      )}
                      {card.badge.text}
                    </div>
                    <Text size="xs" color="primary-700">
                      {card.badge.description}
                    </Text>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};
