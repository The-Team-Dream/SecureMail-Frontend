"use client";
import { motion } from "framer-motion";
import { AnalyticsOverview } from "@/APIs/types/Analytics";
import { Text } from "@/_components/shared/Text";
import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useSystemHealth } from "@/APIs/hooks/system/useSystemHealth";

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
  const { data: healthData, isLoading: isHealthLoading } = useSystemHealth();

  if (isLoading || isHealthLoading) {
    return <StatsSkeleton />;
  }

  const totalThreats =
    (overview?.totalPhishingDetected || 0) + 
    (overview?.totalSpamDetected || 0) + 
    (overview?.totalMalwareDetected || 0);

  const getTrendType = (trend?: string) => {
    if (!trend) return "increase";
    return trend.startsWith("-") ? "decrease" : "increase";
  };

  const statCards = [
    {
      title: "Total Threats Blocked",
      value: totalThreats,
      badge: {
        text: overview?.threatsChange || "0%",
        type: getTrendType(overview?.threatsChange),
        description: "Comparison vs previous 30 days",
      },
      icon: Shield,
    },
    {
      title: "Phishing & Malware",
      value: (overview?.totalPhishingDetected || 0) + (overview?.totalMalwareDetected || 0),
      badge: {
        text: overview?.phishingChange || "0%",
        type: getTrendType(overview?.phishingChange),
        description: "Critical threats detected",
      },
      icon: ShieldAlert,
    },
    {
      id: "health",
      title: "System Health",
      value: healthData?.overall === "healthy" ? "100%" : "Issues",
      status: healthData?.overall === "healthy" ? "Operational" : "Degraded",
      color: healthData?.overall === "healthy" ? "secondary-800" : "error-500",
      icon: Activity,
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
                <div className="flex items-center justify-between">
                   <Text color="primary-800">{card.title}</Text>
                   <card.icon className={cn("w-4 h-4", healthData?.overall === "healthy" ? "text-secondary-800" : "text-error-500")} />
                </div>

                <Text size={"4xl"} font={"bold"}>
                  {card.value}
                </Text>
              </div>

              <div className="flex flex-col gap-1">
                <Text color={card.color as any} size={"lg"} font={"medium"}>
                  {card.status}
                </Text>
                <div className={cn("w-full h-[3px] rounded-full", healthData?.overall === "healthy" ? "bg-secondary-800" : "bg-error-500")} />
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Text>{card.title}</Text>
                  <card.icon className="w-4 h-4 text-primary-400" />
                </div>

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
                        <TrendingUp size={12} className="stroke-[3px]" />
                      ) : (
                        <TrendingDown size={12} className="stroke-[3px]" />
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
