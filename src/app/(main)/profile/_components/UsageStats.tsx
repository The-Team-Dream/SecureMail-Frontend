"use client";
import { Text } from "@/_components/shared/Text";
import { Database, HardDrive, Mail, Shield, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface UsageStatsProps {
  totalMailboxes: number;
  storageUsed: number;
  totalThreats: number;
}

export const UsageStats = ({
  totalMailboxes,
  storageUsed,
  totalThreats,
}: UsageStatsProps) => {
  // Convert bytes to MB/GB
  const formatStorage = (bytes: number) => {
    if (bytes === 0) return "0 MB";
    const mb = bytes / (1024 * 1024);
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    return `${(mb / 1024).toFixed(1)} GB`;
  };

  const stats = [
    {
      label: "Mailboxes",
      value: totalMailboxes,
      icon: Mail,
      color: "bg-secondary-50 text-secondary-800",
      description: "Connected accounts",
    },
    {
      label: "Storage",
      value: formatStorage(storageUsed),
      icon: HardDrive,
      color: "bg-secondary-50 text-secondary-800",
      description: "Total space used",
    },
    {
      label: "Security Score", // Re-labeled from threats to be more positive
      value: totalThreats,
      icon: Shield,
      color: "bg-secondary-50 text-secondary-800",
      description: "Total threats blocked",
    },
  ];

  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-background border border-primary-100 p-8 h-full shadow-sm">
      <Text size="lg" font="bold">
        Usage & Performance
      </Text>

      <div className="grid grid-cols-1 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group flex items-center justify-between p-5 rounded-2xl bg-primary-50/30 border border-primary-100/20 hover:border-primary-100 transition-all hover:bg-white hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${stat.color}`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <Text
                  size="xs"
                  color="primary-400"
                  className="uppercase tracking-widest font-bold"
                >
                  {stat.label}
                </Text>
                <Text size="sm" color="primary-500" className="mt-0.5">
                  {stat.description}
                </Text>
              </div>
            </div>
            <Text size="xl" font="bold" color="primary-950">
              {stat.value}
            </Text>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
