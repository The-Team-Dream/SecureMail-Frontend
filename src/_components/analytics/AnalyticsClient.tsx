"use client";
import { AnalyticsChart } from "./AnalyticsChart";
import Container from "@/_components/shared/Container";
import { Text } from "@/_components/shared/Text";
import { AnalyticsSkeleton } from "@/_components/skeleton/AnalyticsSkeleton";
import {
  useAnalyticsOverview,
  useMailboxStats,
  useActivityStats,
} from "@/APIs/hooks/useAnalytics";
import { useNotifications } from "@/APIs/hooks/useNotifications";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { StateMessage } from "@/_components/shared/StateMessage";
import { StatItem, NotificationItem } from "@/types/analytics";
import {
  Mail,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  CircleX,
  AlertTriangle,
  Info,
} from "lucide-react";

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
  const { data: user } = useGetAuthMe();

  // Mock Data mimicking Backend structure
  const MOCK_OVERVIEW_DATA = {
    totalMailboxes: 8,
    totalEmailsScanned: 24582,
    totalThreatsBlocked: 1482,
    phishingDetected: 642,
    malwareDetected: 840,
    safetyScore: 98,
  };

  const MOCK_MAILBOX_DATA = {
    mailboxId: mailboxId || "mock-id",
    emailCount: 1240,
    threatsHistory: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
      count: Math.floor(Math.random() * 20) + 5,
    })),
    topThreatTypes: [
      { type: "Spam Detection", value: 85 },
      { type: "Phishing Attempts", value: 42 },
      { type: "Malware Blocks", value: 12 },
    ],
  };

  const MOCK_ACTIVITY_DATA = Array.from({ length: 8 }, (_, i) => ({
    timestamp: new Date(
      Date.now() - (7 - i) * 24 * 60 * 60 * 1000,
    ).toISOString(),
    sent: Math.floor(Math.random() * 100) + 50,
    received: Math.floor(Math.random() * 200) + 100,
    blocked: Math.floor(Math.random() * 30) + 5,
  }));

  const MOCK_NOTIFICATIONS_DATA = {
    data: [
      {
        id: 1,
        title: "Unauthorized Access Attempt",
        message: "IP: 192.168.1.254 • Location: Unknown",
        type: "error" as const,
        category: "threats" as const,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "SSL Certificate Renewed",
        message: "Domain: secure.mail-service.io",
        type: "info" as const,
        category: "system" as const,
        isRead: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 3,
        title: "Policy Update Detected",
        message: "Filter: Restricted Attachments",
        type: "warning" as const,
        category: "updates" as const,
        isRead: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
    total: 3,
    page: 1,
    totalPages: 1,
  };

  // Uncomment hooks when ready to link
  /*
  const { data: overviewData, isLoading: isOverviewLoading, isError: isOverviewError, refetch: refetchOverview } = useAnalyticsOverview();
  const { data: mailboxData, isLoading: isMailboxLoading, isError: isMailboxError, refetch: refetchMailbox } = useMailboxStats(mailboxId || "");
  const { data: activityData, isLoading: isActivityLoading } = useActivityStats('weekly');
  const { data: notificationsData, isLoading: isNotificationsLoading } = useNotifications(1);
  */

  // Using Mock Data instead of API hooks
  const overviewData = MOCK_OVERVIEW_DATA;
  const mailboxData = mailboxId ? MOCK_MAILBOX_DATA : null;
  const activityData = MOCK_ACTIVITY_DATA;
  const notificationsData = MOCK_NOTIFICATIONS_DATA;

  const isLoading = false; // Set to true to test skeletons
  const isError = false;
  const refetch = () => console.log("Refetching...");

  if (isLoading) return <AnalyticsSkeleton />;

  if (isError)
    return (
      <StateMessage
        variant="error"
        title="Analytics Interrupted"
        description="Can not load analytics data right now."
        onRetry={() => refetch()}
        className="h-screen"
      />
    );

  // Stats Mapping Logic
  let stats: StatItem[] = [];
  if (mailboxId && mailboxData) {
    const totalThreats = mailboxData.topThreatTypes.reduce(
      (acc, curr) => acc + curr.value,
      0,
    );
    stats = [
      {
        id: 1,
        title: "Mailbox Emails",
        value: mailboxData.emailCount.toLocaleString(),
        type: "healthy",
        icon: Mail,
        description: "Total emails in this mailbox",
      },
      {
        id: 2,
        title: "Threats Detected",
        value: totalThreats.toLocaleString(),
        change: "Active",
        type: "decrease",
        icon: ShieldAlert,
        description: "Security incidents found",
      },
      {
        id: 3,
        title: "Top Threat Type",
        value: mailboxData.topThreatTypes[0]?.type || "None",
        status: "Identified",
        type: "healthy",
        icon: TrendingUp,
        description: "Most frequent threat vector",
      },
    ];
  } else if (overviewData) {
    stats = [
      {
        id: 1,
        title: "Total Emails Scanned",
        value: overviewData.totalEmailsScanned.toLocaleString(),
        type: "healthy",
        icon: Mail,
        description: "Across all active mailboxes",
      },
      {
        id: 2,
        title: "Threats Blocked",
        value: overviewData.totalThreatsBlocked.toLocaleString(),
        change: `${((overviewData.totalThreatsBlocked / (overviewData.totalEmailsScanned || 1)) * 100).toFixed(1)}%`,
        type: "increase",
        icon: ShieldAlert,
        description: "Detection rate ratio",
      },
      {
        id: 3,
        title: "Safety Score",
        value: `${overviewData.safetyScore}%`,
        status: overviewData.safetyScore > 80 ? "Stable" : "Critical",
        type: overviewData.safetyScore > 80 ? "healthy" : "decrease",
        icon: ShieldCheck,
        description: "Overall system health",
      },
    ];
  }

  // Chart Data Mapping
  let chartData: any = [];
  if (mailboxId && mailboxData) {
    chartData = mailboxData.threatsHistory.map((item) => ({
      month: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      spam: item.count,
      phishing: Math.floor(item.count * 0.4), // Mocking phishing split if not provided
    }));
  } else if (activityData) {
    chartData = activityData.map((item: any) => ({
      month: new Date(item.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      spam: item.blocked || 0,
      phishing: item.received || 0,
    }));
  }

  const spamCount = mailboxId
    ? (
        mailboxData?.topThreatTypes.find((t) =>
          t.type.toLowerCase().includes("spam"),
        )?.value || 0
      ).toLocaleString()
    : overviewData?.malwareDetected.toLocaleString() || "0";

  const phishingCount = mailboxId
    ? (
        mailboxData?.topThreatTypes.find((t) =>
          t.type.toLowerCase().includes("phishing"),
        )?.value || 0
      ).toLocaleString()
    : overviewData?.phishingDetected.toLocaleString() || "0";

  // Notifications Mapping
  const notifications: NotificationItem[] = (notificationsData?.data || [])
    .slice(0, 3)
    .map((n, idx) => ({
      id: n.id,
      title: n.title,
      subtitle: n.message,
      time: new Date(n.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      severity:
        n.type === "error" ? "HIGH" : n.type === "warning" ? "MEDIUM" : "INFO",
      type:
        n.type === "error"
          ? "error"
          : n.type === "warning"
            ? "warning"
            : "info",
      icon:
        n.type === "error"
          ? CircleX
          : n.type === "warning"
            ? AlertTriangle
            : Info,
    }));

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
