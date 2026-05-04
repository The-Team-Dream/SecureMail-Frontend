"use client";
import { AnalyticsChart } from "./AnalyticsChart";
import Container from "@/_components/shared/Container";
import { Text } from "@/_components/shared/Text";
import { AnalyticsSkeleton } from "@/_components/skeleton/AnalyticsSkeleton";
import {
  useAnalyticsOverview,
  useMailboxStats,
} from "@/APIs/hooks/useAnalytics";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { StateMessage } from "@/_components/shared/StateMessage";
import {
  stats as generalStats,
  notifications as generalNotifications,
  StatItem,
  NotificationItem,
} from "@/types/analytics";

import {
  stats as mailboxStats,
  notifications as mailboxNotifications,
} from "@/app/(main)/mailboxes/[mailboxId]/analytics/MOCK_DATA";
import { useGetAuthMe } from "@/APIs/hooks/useAuth";

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

interface AnalyticsClientProps {
  mailboxId?: string;
}

const AnalyticsClient = ({ mailboxId }: AnalyticsClientProps) => {
  const overviewQuery = useAnalyticsOverview();
  const mailboxQuery = useMailboxStats(mailboxId || "");
  const { data: user } = useGetAuthMe();

  const query = mailboxId ? mailboxQuery : overviewQuery;
  // const { data, isLoading, isError, refetch } = query;

  const stats = mailboxId ? mailboxStats : generalStats;
  const notifications = mailboxId ? mailboxNotifications : generalNotifications;

  // Analytics Chart Overview
  const generalChartData = [
    { month: "Jul", spam: 45, phishing: 30 },
    { month: "Aug", spam: 52, phishing: 25 },
    { month: "Sep", spam: 48, phishing: 35 },
    { month: "Oct", spam: 70, phishing: 20 },
    { month: "Nov", spam: 40, phishing: 55 },
    { month: "Dec", spam: 35, phishing: 45 },
    { month: "Jan", spam: 50, phishing: 40 },
    { month: "Feb", spam: 65, phishing: 30 },
  ];
  // Mailbox Chart Overview
  const mailboxChartData = [
    { month: "Jul", spam: 5, phishing: 10 },
    { month: "Aug", spam: 7, phishing: 15 },
    { month: "Sep", spam: 8, phishing: 10 },
    { month: "Oct", spam: 2, phishing: 12 },
    { month: "Nov", spam: 8, phishing: 12 },
    { month: "Dec", spam: 12, phishing: 9 },
    { month: "Jan", spam: 4, phishing: 16 },
    { month: "Feb", spam: 16, phishing: 14 },
  ];

  const chartData = mailboxId ? mailboxChartData : generalChartData;
  const spamCount = mailboxId ? "105" : "8,429";
  const phishingCount = mailboxId ? "131" : "4,053";

  // if (isLoading) return <AnalyticsSkeleton />;
  // if (isError)
  //   return (
  //     <StateMessage
  //       variant="error"
  //       title="Analytics Interrupted"
  //       description="Can not load analytics data right now."
  //       onRetry={() => refetch()}
  //     />
  //   );

  const severityConfig: Record<
    string,
    { container: string; iconBg: string; textColor: string }
  > = {
    error: {
      container: "bg-error-50/50",
      iconBg: "bg-error-50 text-error-500",
      textColor: "text-error-500",
    },
    info: {
      container: "bg-secondary-50/50",
      iconBg: "bg-secondary-50 text-secondary-800",
      textColor: "text-secondary-800",
    },
    warning: {
      container: "bg-warning-50/50",
      iconBg: "bg-warning-50 text-warning-600",
      textColor: "text-warning-600",
    },
  };

  const statsConfig: Record<
    string,
    { badge: string; color: string; bar?: string }
  > = {
    increase: {
      badge: "bg-secondary-200 text-secondary-800",
      color: "text-secondary-800",
    },
    decrease: {
      badge: "bg-error-50 text-error-600",
      color: "text-error-600",
    },
    healthy: {
      badge: "",
      color: "text-secondary-700",
      bar: "bg-secondary-700",
    },
  };

  return (
    <Container>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Text size={"2xl"} font={"medium"}>
          Good Morning, {user?.user?.username || "User"}
        </Text>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8"
      >
        {stats.map((state: StatItem) => {
          const style = statsConfig[state.type];
          const Icon = state.icon;
          return (
            <motion.div
              variants={itemVariants}
              key={state.id}
              whileHover={{ y: -5 }}
              className="flex flex-col gap-4 rounded-xl bg-ghostBlue p-4 transition-shadow hover:shadow-md"
            >
              <Text color="primary-500" size={"sm"} className="tracking-wide">
                {state.title}
              </Text>

              <Text size={"3xl"} font={"bold"} color={`primary-950`}>
                {state.value}
              </Text>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  {state.change && (
                    <Badge
                      className={cn(
                        "text-sm font-medium   px-4 rounded-full flex items-center gap-1",
                        style.badge,
                      )}
                    >
                      {Icon && <Icon size={14} strokeWidth={3} />}
                      {state.change}
                    </Badge>
                  )}
                  {state.status && (
                    <Text font="medium" className={style.color}>
                      {state.status}
                    </Text>
                  )}
                  <Text size="xs" color="primary-400">
                    {state.description}
                  </Text>
                </div>
                {state.type === "healthy" && (
                  <div className="w-full h-1.5 bg-primary-100 rounded-full overflow-hidden mt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={cn("h-full rounded-full", style.bar)}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 md:mt-8">
        {/* Analytics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="min-w-0"
        >
          <AnalyticsChart
            data={chartData}
            spamCount={spamCount}
            phishingCount={phishingCount}
          />
        </motion.div>
        {/* Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="min-w-0 border border-primary-100 rounded-lg p-6 max-h-[500px] h-full"
        >
          <Text size={"lg"} font={"medium"} className="mb-2">
            Recent Security Events
          </Text>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-4"
          >
            {notifications.map((notification: NotificationItem) => {
              const style = severityConfig[notification.type];
              const Icon = notification.icon;
              return (
                <motion.div
                  variants={itemVariants}
                  key={notification.id}
                  whileHover={{ x: 5 }}
                  className="bg-ghostBlue rounded-lg p-6 transition-all duration-300 border border-transparent hover:border-primary-100"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "p-2 rounded-lg flex items-center justify-center shrink-0",
                        style.iconBg,
                      )}
                    >
                      <Icon size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-center justify-between">
                        <Text as={"h1"} size={"sm"} color={"primary-950"}>
                          {notification.title}
                        </Text>
                        <Text
                          font="bold"
                          size="xs"
                          className={cn(
                            "uppercase tracking-wider",
                            style.textColor,
                          )}
                        >
                          {notification.severity}
                        </Text>
                      </div>
                      <Text as={"p"} size={"sm"} color={"primary-500"}>
                        {notification.subtitle}
                      </Text>
                      <Text
                        as={"span"}
                        color={"primary-500"}
                        className="text-[10px]"
                      >
                        {notification.time}
                      </Text>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </Container>
  );
};

export default AnalyticsClient;
