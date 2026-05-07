"use client";
import { motion } from "framer-motion";
import { AnalyticsOverview } from "@/APIs/types/Analytics";
import { Text } from "@/_components/shared/Text";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Mail, Shield, HardDrive, ArrowUpRight, ArrowDownRight } from "lucide-react";

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

export const AnalyticsStats = ({ overview, isLoading }: AnalyticsStatsProps) => {
  const statCards = [
    {
      title: "Total Emails",
      value: (overview?.totalEmails ?? 0).toLocaleString(),
      change: "+0%",
      type: "increase",
      icon: Mail,
      description: "Emails processed this month"
    },
    {
      title: "Phishing Detected",
      value: (overview?.totalPhishingDetected ?? 0).toLocaleString(),
      change: "-0%",
      type: "decrease",
      icon: Shield,
      description: "Threats blocked by our system"
    },
    {
      title: "Storage Used",
      value: typeof overview?.totalStorageUsed === 'number' 
        ? `${(overview.totalStorageUsed / (1024 * 1024)).toFixed(1)} MB` 
        : "0.0 MB",
      change: "Stable",
      type: "healthy",
      icon: HardDrive,
      description: "Total storage across mailboxes"
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8"
    >
      {statCards.map((card, index) => {
        const isIncrease = card.type === "increase";
        const isHealthy = card.type === "healthy";
        const Icon = card.icon;

        return (
          <motion.div
            variants={itemVariants}
            key={index}
            whileHover={{ y: -5 }}
            className="flex flex-col gap-4 rounded-xl bg-ghostBlue p-4 transition-shadow hover:shadow-md border border-transparent hover:border-primary-100/50"
          >
            <div className="flex items-center justify-between">
              <Text color="primary-500" size={"sm"} className="tracking-wide">
                {card.title}
              </Text>
              <div className="p-2 rounded-lg bg-white/50 shadow-sm text-primary-400">
                <Icon size={18} />
              </div>
            </div>

            <Text size={"3xl"} font={"bold"} color={`primary-950`}>
              {card.value}
            </Text>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                {!isHealthy && (
                  <Badge
                    className={cn(
                      "text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1",
                      isIncrease ? "bg-secondary-100 text-secondary-800" : "bg-error-50 text-error-600"
                    )}
                  >
                    {isIncrease ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {card.change}
                  </Badge>
                )}
                {isHealthy && (
                   <Text font="medium" size="xs" className="text-secondary-700 bg-secondary-50 px-2.5 py-0.5 rounded-full">
                    {card.change}
                   </Text>
                )}
                <Text size="xs" color="primary-400">
                  {card.description}
                </Text>
              </div>
              {isHealthy && (
                <div className="w-full h-1.5 bg-primary-100 rounded-full overflow-hidden mt-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full bg-secondary-700"
                  />
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
