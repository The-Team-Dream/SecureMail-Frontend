"use client";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { format, subDays, isValid } from "date-fns";
import { AnalyticsStats } from "./AnalyticsStats";
import Container from "@/_components/shared/Container";
import { Text } from "@/_components/shared/Text";
import {
  useAnalyticsOverview,
  useMailboxStats,
  useActivityStats,
} from "@/APIs/hooks/analytics";
import { RecentSecurityEvents } from "./RecentSecurityEvents";
import { motion } from "framer-motion";
import { StateMessage } from "@/_components/shared/StateMessage";

import { useGetAuthMe } from "@/APIs/hooks/auth";
import { getFirstName } from "@/lib/utils";
import { ActivityData } from "@/APIs/types/Analytics";
import notFoundImg from "../../../public/images/not-found.png";

import { Skeleton } from "@/components/ui/skeleton";
import { ChartSkeleton } from "../skeleton/ChartSkeleton";

const AnalyticsChart = dynamic(
  () => import("./AnalyticsChart").then((mod) => mod.AnalyticsChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

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

  // Handle nested "data" property from API responses - Memoized for performance
  const finalOverviewData = useMemo(
    () => (overviewData as any)?.data || overviewData,
    [overviewData],
  );
  const finalMailboxData = useMemo(
    () => (mailboxData as any)?.data || mailboxData,
    [mailboxData],
  );
  const finalActivityData = useMemo(() => {
    return Array.isArray((activityData as any)?.data)
      ? (activityData as any).data
      : Array.isArray(activityData)
        ? activityData
        : [];
  }, [activityData]);

  const statsOverview = useMemo(() => {
    if (mailboxId && finalMailboxData) {
      return {
        totalMailboxesConnected: 1,
        totalEmails: finalMailboxData.totalEmails || 0,
        totalPhishingDetected: finalMailboxData.phishingEmails || 0,
        totalSpamDetected: finalMailboxData.spamEmails || 0,
        totalMalwareDetected: 0,
        totalStorageUsed: finalMailboxData.storageUsed || 0,
        threatsChange: finalMailboxData.threatsChange || "0%",
        phishingChange: finalMailboxData.phishingChange || "0%",
      };
    }
    return finalOverviewData;
  }, [mailboxId, finalOverviewData, finalMailboxData]);

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

  // Chart Data Mapping - Memoized to prevent expensive recalculations on every render
  const { finalChartData, totalSpam, totalPhishing, totalSent, totalReceived } =
    useMemo(() => {
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
          spam: item.spam || 0,
          phishing: item.phishing || 0,
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

      const chartLength = 7;
      const calculatedChartData = Array.from(
        { length: chartLength },
        (_, i) => {
          const daysAgo = i === 0 ? 0 : 7 - i;
          const day = subDays(new Date(), daysAgo);
          const dateKey = format(day, "yyyy-MM-dd");

          const dayLabel = format(day, "EEE");
          const existingDay = dataMap.get(dateKey);

          return {
            day: dayLabel,
            spam: existingDay?.spam || 0,
            phishing: existingDay?.phishing || 0,
            sent: existingDay?.sent || 0,
            received: existingDay?.received || 0,
          };
        },
      );

      let tSpam = calculatedChartData.reduce((acc, curr) => acc + curr.spam, 0);
      let tPhishing = calculatedChartData.reduce(
        (acc, curr) => acc + curr.phishing,
        0,
      );
      const tSent = calculatedChartData.reduce(
        (acc, curr) => acc + curr.sent,
        0,
      );
      const tReceived = calculatedChartData.reduce(
        (acc, curr) => acc + curr.received,
        0,
      );

      // If the overview/mailbox totals exceed what's in the history,
      // inject the difference into a middle slot to create a peak curve shape
      const peakIndex = 1;
      if (!mailboxId && finalOverviewData) {
        const spamDiff = (finalOverviewData.totalSpamDetected || 0) - tSpam;
        if (spamDiff > 0) {
          calculatedChartData[peakIndex].spam += spamDiff;
          tSpam += spamDiff;
        }
        const phishingDiff =
          (finalOverviewData.totalPhishingDetected || 0) - tPhishing;
        if (phishingDiff > 0) {
          calculatedChartData[peakIndex].phishing += phishingDiff;
          tPhishing += phishingDiff;
        }
      } else if (mailboxId && finalMailboxData) {
        const spamDiff = (finalMailboxData.spamEmails || 0) - tSpam;
        if (spamDiff > 0) {
          calculatedChartData[peakIndex].spam += spamDiff;
          tSpam += spamDiff;
        }
        const phishingDiff = (finalMailboxData.phishingEmails || 0) - tPhishing;
        if (phishingDiff > 0) {
          calculatedChartData[peakIndex].phishing += phishingDiff;
          tPhishing += phishingDiff;
        }
      }

      return {
        finalChartData: calculatedChartData,
        totalSpam: tSpam,
        totalPhishing: tPhishing,
        totalSent: tSent,
        totalReceived: tReceived,
      };
    }, [mailboxId, finalMailboxData, finalActivityData, finalOverviewData]);

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
          <Text size={"2xl"} font={"bold"}>
            Good Morning, {getFirstName(user?.user?.username) || "User"}
          </Text>
        )}
      </motion.div>

      <AnalyticsStats
        overview={statsOverview}
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
