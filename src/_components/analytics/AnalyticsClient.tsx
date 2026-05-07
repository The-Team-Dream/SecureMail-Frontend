"use client";
import { AnalyticsChart } from "./AnalyticsChart";
import { AnalyticsStats } from "./AnalyticsStats";
import Container from "@/_components/shared/Container";
import { Text } from "@/_components/shared/Text";
import { AnalyticsSkeleton } from "@/_components/skeleton/AnalyticsSkeleton";
import {
  useAnalyticsOverview,
  useMailboxStats,
  useActivityStats,
} from "@/APIs/hooks/useAnalytics";
import {
  useNotifications,
  useNotificationOperations,
} from "@/APIs/hooks/useNotifications";
import { useMailboxReports } from "@/APIs/hooks/useMailboxes";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { StateMessage } from "@/_components/shared/StateMessage";
import { StatItem, NotificationItem } from "@/types/analytics";
import { Button } from "@/components/ui/button";
import {
  Mail,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  CircleX,
  AlertTriangle,
  Info,
  Star,
  Trash2,
} from "lucide-react";

import { useGetAuthMe } from "@/APIs/hooks/useAuth";
import { ActivityData } from "@/APIs/types/Analytics";

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

  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    refetch: refetchOverview,
  } = useAnalyticsOverview();
  console.log("overviewData", overviewData);

  const {
    data: mailboxData,
    isLoading: isMailboxLoading,
    isError: isMailboxError,
    refetch: refetchMailbox,
  } = useMailboxStats(mailboxId || "");

  const { data: activityData, isLoading: isActivityLoading } =
    useActivityStats("weekly");
  console.log("activityData", activityData);
  const { data: notificationsData, isLoading: isNotificationsLoading } =
    useNotifications();

  const { data: reportsData, isLoading: isReportsLoading } = useMailboxReports(
    mailboxId || "",
  );

  const isLoading = mailboxId
    ? isMailboxLoading ||
      isActivityLoading ||
      isNotificationsLoading ||
      isReportsLoading
    : isOverviewLoading || isActivityLoading || isNotificationsLoading;

  const isError = mailboxId ? isMailboxError : isOverviewError;

  const refetch = () => {
    if (mailboxId) {
      refetchMailbox();
    } else {
      refetchOverview();
    }
  };

  const { deleteNotification } = useNotificationOperations();

  // Handle nested "data" property from API responses
  const finalOverviewData = (overviewData as any)?.data || overviewData;
  const finalMailboxData = (mailboxData as any)?.data || mailboxData;
  const finalActivityData = Array.isArray((activityData as any)?.data)
    ? (activityData as any).data
    : Array.isArray(activityData)
      ? activityData
      : [];
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
  if (mailboxId && finalMailboxData) {
    const totalThreats =
      finalMailboxData.topThreatTypes?.reduce(
        (acc: number, curr: any) => acc + curr.value,
        0,
      ) ?? 0;
    stats = [
      {
        id: 1,
        title: "Mailbox Emails",
        value: "2",
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
        value: finalMailboxData.topThreatTypes?.[0]?.type ?? "None",
        status: "Identified",
        type: "healthy",
        icon: TrendingUp,
        description: "Most frequent threat vector",
      },
    ];
  } else if (finalOverviewData) {
    stats = [
      {
        id: 1,
        title: "Total Emails Scanned",
        value: (finalOverviewData.totalEmails ?? 0).toLocaleString(),
        type: "healthy",
        icon: Mail,
        description: "Across all active mailboxes",
      },
      {
        id: 2,
        title: "Threats Blocked",
        value: (
          (finalOverviewData.totalPhishingDetected ?? 0) +
          (finalOverviewData.totalSpamDetected ?? 0)
        ).toLocaleString() || "0",
        change: `${((((finalOverviewData.totalPhishingDetected ?? 0) + (finalOverviewData.totalSpamDetected ?? 4)) / (finalOverviewData.totalEmails || 1)) * 100).toFixed(1)}%`,
        type: "increase",
        icon: ShieldAlert,
        description: "Detection rate ratio",
      },
      {
        id: 3,
        title: "Connected Mailboxes",
        value: (finalOverviewData.totalMailboxesConnected ?? 0).toString(),
        status:
          finalOverviewData.totalMailboxesConnected > 0 ? "Active" : "None",
        type:
          finalOverviewData.totalMailboxesConnected > 0
            ? "healthy"
            : "decrease",
        icon: ShieldCheck,
        description: "Total mailboxes being monitored",
      },
    ];
  }

  // Chart Data Mapping
  let chartData: ActivityData[] = [];
  if (mailboxId && finalMailboxData) {
    chartData = (finalMailboxData.threatsHistory || []).map((item: any) => ({
      month: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      spam: item.count,
      phishing: Math.floor(item.count * 0.4), // Mocking phishing split if not provided
    }));
  } else if (finalActivityData) {
    chartData = finalActivityData.map((item: any) => ({
      month: new Date(item.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      spam: item.blocked,
      phishing: item.received,
    }));
  }

  const finalChartData =
    chartData && chartData.length > 0
      ? chartData
      : Array.from({ length: 7 }, (_, i) => ({
          month: new Date(
            Date.now() - (6 - i) * 24 * 60 * 60 * 1000,
          ).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          spam: 0,
          phishing: 0,
        }));

  const spamCount = mailboxId
    ? (
        finalMailboxData?.topThreatTypes?.find((t: any) =>
          t.type.toLowerCase().includes("spam"),
        )?.value ?? 0
      ).toLocaleString()
    : finalOverviewData?.totalSpamDetected;

  const phishingCount = mailboxId
    ? finalMailboxData?.topThreatTypes?.find((t: any) =>
        t.type.toLowerCase().includes("phishing"),
      )?.value
    : finalOverviewData?.totalPhishingDetected;

  // Notifications & Reports Mapping
  const rawNotifications = Array.isArray(notificationsData?.data)
    ? notificationsData.data
    : Array.isArray(notificationsData)
      ? notificationsData
      : [];

  const rawReports = Array.isArray((reportsData as any)?.reports)
    ? (reportsData as any).reports
    : Array.isArray(reportsData)
      ? reportsData
      : [];

  const notifications: NotificationItem[] = [
    ...rawReports.map((r: any) => ({
      id: r.id,
      title: r.subject || "Flagged Email",
      subtitle: `From: ${r.sender} - Type: ${r.threatType}`,
      time: new Date(r.date || Date.now()).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      severity: r.threatType?.toLowerCase() === "phishing" ? "HIGH" : "MEDIUM",
      type: r.threatType?.toLowerCase() === "phishing" ? "error" : "warning",
      icon:
        r.threatType?.toLowerCase() === "phishing" ? CircleX : AlertTriangle,
    })),
    ...rawNotifications
      .map((n: any) => ({
        id: n.id,
        title: n.title,
        subtitle: n.message,
        time: new Date(n.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        severity:
          n.type === "error"
            ? "HIGH"
            : n.type === "warning"
              ? "MEDIUM"
              : "INFO",
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
      }))
      .slice(0, 10),
  ];

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

      <AnalyticsStats
        overview={finalOverviewData}
        isLoading={mailboxId ? isMailboxLoading : isOverviewLoading}
      />

      {/* Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 md:mt-8">
        {/* Analytics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="min-w-0"
        >
          {isActivityLoading || (mailboxId && isMailboxLoading) ? (
            <div className="h-[450px] w-full bg-ghostBlue animate-pulse rounded-xl" />
          ) : (
            <AnalyticsChart
              data={finalChartData}
              spamCount={spamCount?.toLocaleString() || "0"}
              phishingCount={phishingCount?.toLocaleString() || "0"}
            />
          )}
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
            className="flex flex-col gap-4 h-full"
          >
            {isNotificationsLoading || (mailboxId && isReportsLoading) ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-ghostBlue rounded-lg p-6 flex items-start gap-4 animate-pulse"
                >
                  <div className="h-10 w-10 bg-primary-100 rounded-lg shrink-0" />
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center justify-between">
                      <div className="h-5 w-1/2 bg-primary-200 rounded" />
                      <div className="h-4 w-16 bg-primary-100 rounded" />
                    </div>
                    <div className="h-4 w-3/4 bg-primary-50 rounded" />
                    <div className="h-3 w-20 bg-primary-100 rounded" />
                  </div>
                </div>
              ))
            ) : notifications.length === 0 ? (
              <div className="h-full flex items-center justify-center py-10">
                <StateMessage
                  variant="empty"
                  title="No Security Events"
                  description="Your workspace is currently safe. No threats detected."
                />
              </div>
            ) : (
              notifications.map((notification: NotificationItem) => {
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
                          <div className="flex flex-col">
                            <Text as={"h1"} size={"sm"} color={"primary-950"}>
                              {notification.title}
                            </Text>
                            <div className="flex items-center gap-1 mt-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-primary-400 hover:text-secondary-500 hover:bg-secondary-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Toggle Star Logic
                                }}
                              >
                                <Star className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-primary-400 hover:text-error-500 hover:bg-error-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(String(notification.id));
                                }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
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
              })
            )}
          </motion.div>
        </motion.div>
      </div>
    </Container>
  );
};

export default AnalyticsClient;
