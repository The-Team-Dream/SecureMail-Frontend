"use client";
import { AnalyticsChart } from "./AnalyticsChart";
import { format, subDays, isValid } from "date-fns";
import { AnalyticsStats } from "./AnalyticsStats";
import Container from "@/_components/shared/Container";
import { Text } from "@/_components/shared/Text";
import {
  useAnalyticsOverview,
  useMailboxStats,
  useActivityStats,
} from "@/APIs/hooks/useAnalytics";
import { RecentSecurityEvents } from "./RecentSecurityEvents";
import { motion } from "framer-motion";
import { StateMessage } from "@/_components/shared/StateMessage";

import { useGetAuthMe } from "@/APIs/hooks/useAuth";
import { ActivityData } from "@/APIs/types/Analytics";
import notFoundImg from "../../../public/images/not-found.png";

import { Skeleton } from "@/components/ui/skeleton";
import { ChartSkeleton } from "../skeleton/ChartSkeleton";

interface AnalyticsClientProps {
  mailboxId?: string;
}

const AnalyticsClient = ({ mailboxId }: AnalyticsClientProps) => {
  const { data: user, isLoading: isUserLoading } = useGetAuthMe();

  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    refetch: refetchOverview,
  } = useAnalyticsOverview();
  const {
    data: mailboxData,
    isLoading: isMailboxLoading,
    isError: isMailboxError,
    refetch: refetchMailbox,
  } = useMailboxStats(mailboxId || "");

  const { data: activityData, isLoading: isActivityLoading } =
    useActivityStats("weekly");

  const isLoading = mailboxId
    ? isMailboxLoading || isActivityLoading
    : isOverviewLoading || isActivityLoading;

  const isError = mailboxId ? isMailboxError : isOverviewError;

  const refetch = () => {
    if (mailboxId) {
      refetchMailbox();
    } else {
      refetchOverview();
    }
  };

  // Handle nested "data" property from API responses
  const finalOverviewData = (overviewData as any)?.data || overviewData;
  const finalMailboxData = (mailboxData as any)?.data || mailboxData;
  const finalActivityData = Array.isArray((activityData as any)?.data)
    ? (activityData as any).data
    : Array.isArray(activityData)
      ? activityData
      : [];

  if (isError)
    return (
      <StateMessage
        variant="error"
        image={notFoundImg}
        title="Analytics Data Unavailable"
        description="We're currently unable to retrieve your mailbox performance and threat analytics. Please ensure your accounts are synced and try again in a few moments."
        onRetry={() => refetch()}
        actionText="Try Again"
        className="min-h-[calc(100vh-200px)]"
      />
    );

  // Chart Data Mapping
  // Chart Data Mapping
  let rawChartData: {
    date: Date;
    spam: number;
    phishing: number;
    sent: number;
    received: number;
  }[] = [];
  if (mailboxId && finalMailboxData?.threatsHistory) {
    rawChartData = finalMailboxData.threatsHistory.map((item: any) => ({
      date: new Date(item.date),
      spam: item.count || 0,
      phishing: Math.floor((item.count || 0) * 0.4),
      sent: item.sent || 0,
      received: item.received || 0,
    }));
  } else if (finalActivityData?.length > 0) {
    rawChartData = finalActivityData.map((item: ActivityData) => ({
      date: new Date(item.date),
      spam: item.spam || 0,
      phishing: item.phishing || 0,
      sent: item.sent || 0,
      received: item.received || 0,
    }));
  }

  // Filter, sort and format
  const validData = rawChartData.filter((item) => isValid(item.date));

  // Create a map of existing data by full date string
  const dataMap = new Map();
  validData.forEach((item) => {
    dataMap.set(format(item.date, "yyyy-MM-dd"), item);
  });

  // Find earliest date with data
  const datesWithData = validData
    .map((item) => format(item.date, "yyyy-MM-dd"))
    .sort();

  const earliestDateStr = datesWithData[0];
  const earliestDate = earliestDateStr
    ? new Date(earliestDateStr)
    : subDays(new Date(), 6);

  // Calculate how many days to show (at least 7, but more if data goes back further)
  const diffInDays = Math.max(
    7,
    Math.ceil(
      (new Date().getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );
  const chartLength = Math.min(diffInDays + 1, 30); // Max 30 days to keep it clean

  // Generate chart data starting from earliest data point or 7 days ago
  const finalChartData = Array.from({ length: chartLength }, (_, i) => {
    const day = subDays(new Date(), chartLength - 1 - i);
    const dateKey = format(day, "yyyy-MM-dd");
    const isToday = i === chartLength - 1;
    const dayLabel = isToday ? "Today" : format(day, "EEE");
    const existingDay = dataMap.get(dateKey);

    return {
      month: dayLabel,
      spam: existingDay?.spam || 0,
      phishing: existingDay?.phishing || 0,
      sent: existingDay?.sent || 0,
      received: existingDay?.received || 0,
    };
  });

  const totalSpam = finalChartData.reduce((acc, curr) => acc + curr.spam, 0);
  const totalPhishing = finalChartData.reduce(
    (acc, curr) => acc + curr.phishing,
    0,
  );
  const totalSent = finalChartData.reduce((acc, curr) => acc + curr.sent, 0);
  const totalReceived = finalChartData.reduce(
    (acc, curr) => acc + curr.received,
    0,
  );

  const spamCount = mailboxId
    ? totalSpam.toLocaleString()
    : (finalOverviewData?.totalSpamDetected ?? totalSpam).toLocaleString();

  const phishingCount = mailboxId
    ? totalPhishing.toLocaleString()
    : (
        finalOverviewData?.totalPhishingDetected ?? totalPhishing
      ).toLocaleString();

  const sentCount = mailboxId
    ? totalSent.toLocaleString()
    : (finalOverviewData?.totalEmailsSent ?? totalSent).toLocaleString();

  const receivedCount = mailboxId
    ? totalReceived.toLocaleString()
    : (
        finalOverviewData?.totalEmailsReceived ?? totalReceived
      ).toLocaleString();

  return (
    <Container>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-1"
      >
        {isUserLoading ? (
          <Skeleton className="h-9 w-64" />
        ) : (
          <Text size={"2xl"} font={"medium"}>
            Good Morning, {user?.user?.username || "User"}
          </Text>
        )}
      </motion.div>

      <AnalyticsStats
        overview={finalOverviewData}
        isLoading={mailboxId ? isMailboxLoading : isOverviewLoading}
      />

      {/* Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 md:mt-8">
        {/* Analytics Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="min-w-0 w-full"
        >
          {isActivityLoading || (mailboxId && isMailboxLoading) ? (
            <ChartSkeleton />
          ) : (
            <AnalyticsChart
              data={finalChartData}
              spamCount={spamCount}
              phishingCount={phishingCount}
            />
          )}
        </motion.div>

        {/* Recent Security Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="min-w-0 w-full"
        >
          <RecentSecurityEvents />
        </motion.div>
      </div>
    </Container>
  );
};

export default AnalyticsClient;
