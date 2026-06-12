"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff } from "lucide-react";
import { Mailbox } from "@/APIs/types/Mailbox";
import { Icons } from "@/constants/icons";
import { Spinner } from "@/components/ui/spinner";
import { ProgressBar } from "@/_components/shared/ProgressBar";
import { useMailboxStats } from "@/APIs/hooks/analytics";
import { useScanQueueStatus } from "@/APIs/hooks/emails";
import { ScanQueueBanner } from "@/_components/mailbox/ScanQueueBanner";
import { differenceInSeconds, formatDistanceToNow } from "date-fns";
export const getStatusStyles = (isActive: boolean) => {
  if (isActive) {
    return {
      color: "text-secondary-800",
      icon: <Wifi className="w-4 h-4" />,
      label: "Connected",
    };
  }
  return {
    color: "text-error-500",
    icon: <WifiOff className="w-4 h-4" />,
    label: "Disconnected",
  };
};

export function MailboxCard({
  acc,
  index,
  isSyncing,
  syncMailbox,
}: {
  acc: Mailbox;
  index: number;
  isSyncing: string | null;
  syncMailbox: (id: number) => void;
}) {
  const statusStyles = getStatusStyles(acc.isActive);
  const { data: stats } = useMailboxStats(String(acc.id));
  const [now, setNow] = useState(() => new Date());

  // Tick every second so the "X seconds ago" display updates in real-time
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const [isDismissed, setIsDismissed] = useState(false);
  const { data: queue } = useScanQueueStatus(String(acc.id));

  // Reset dismissed state when new scanning jobs start
  useEffect(() => {
    if (queue && queue.activeCount > 0) {
      setIsDismissed(false);
    }
  }, [queue?.activeCount]);

  const showBanner = queue && (queue.activeCount + queue.waitingCount > 0) && !isDismissed;
  const totalThreats = (stats?.phishingEmails ?? 0) + (stats?.spamEmails ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.15,
        delay: index * 0.02,
        ease: "easeOut",
      }}
      whileHover={{ y: -5 }}
      className="group flex flex-col gap-3 w-full"
    >
      {showBanner && (
        <div className="h-[48px] mb-4 mt-2 flex items-center">
          {/* نترك البانر يظهر ويختفي داخله بدون أن يؤثر على طول الكارت */}
          <ScanQueueBanner mailboxId={String(acc.id)} onDismiss={() => setIsDismissed(true)} />
        </div>
      )}
      <Link
        href={`/mailboxes/${acc.id}/inbox`}
        className="bg-background border border-primary-100/60 rounded-lg py-6 px-8 max-h-[350px] h-full flex flex-col gap-8 shadow-[0_4px_16px_rgba(223, 223, 223, 0.5)] transition-all hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] cursor-pointer hover:border-primary-200"
      >
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
            <div className="w-[46px] h-[46px] min-w-[46px] rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
              <Icons.Mail className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <Text size="sm" font={"medium"}>
                {acc.emailAddress}
              </Text>
              <Text size="xs">{acc.provider}</Text>
            </div>
          </div>
          <div
            className={`flex items-center gap-1.5 text-xs font-medium ${statusStyles.color} pt-1 shrink-0`}
          >
            {statusStyles.icon}
            <span className="hidden md:block">{statusStyles.label}</span>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-center flex-1">
            <Text size="2xl" color={"info-700"} font="medium">
              {stats?.totalEmails ?? 0}
            </Text>
            <Text size="xs" color={"primary-500"} className="mt-1">
              Total Emails
            </Text>
          </div>
          <div className="w-px h-10 bg-primary-100/60 shrink-0"></div>
          <div className="flex flex-col items-center flex-1">
            <Text size="2xl" color={"error-600"} font="semiBold">
              {totalThreats}
            </Text>
            <Text size="xs" color={"primary-500"} className="mt-1">
              Threats
            </Text>
          </div>
          <div className="w-px h-10 bg-primary-100/60 shrink-0" />
          <div className="flex flex-col items-center flex-1">
            <Text
              size="xl"
              font="semiBold"
              color={"primary-800"}
              className="text-center"
            >
              {acc?.lastSyncedAt
                ? (() => {
                    const diffInSecs = differenceInSeconds(
                      now,
                      new Date(acc.lastSyncedAt),
                    );

                    if (diffInSecs <= 0) {
                      return "Just now";
                    }

                    if (diffInSecs < 60) {
                      return `${diffInSecs} ${diffInSecs === 1 ? "second" : "seconds"} ago`;
                    }

                    return formatDistanceToNow(new Date(acc.lastSyncedAt), {
                      addSuffix: true,
                    });
                  })()
                : "Never"}
            </Text>
            <Text size="xs" color={"primary-500"} className="mt-1">
              Last sync
            </Text>
          </div>
        </div>
        {/* Sync Button Section */}
        <div className="flex flex-col gap-3">
          <Button
            disabled={isSyncing === acc.id.toString()}
            variant="outline"
            className="relative flex-1 rounded-lg border-primary text-sm gap-2 overflow-hidden"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              syncMailbox(acc.id);
            }}
          >
            {isSyncing === acc.id.toString() && (
              <div className="absolute inset-0 z-0 flex items-center">
                <ProgressBar
                  isLoading={isSyncing === acc.id.toString()}
                  className="bg-transparent rounded-lg"
                  barClassName="bg-primary-400/60"
                />
              </div>
            )}

            <div className="relative z-10 flex items-center justify-center gap-2 w-full">
              {isSyncing === acc.id.toString() ? (
                <>
                  <span className="text-primary-900">Syncing... </span>
                  <Spinner className="w-4 h-4 text-primary-900" />
                </>
              ) : (
                <>
                  <span className="text-primary-900">Sync </span>
                  <Icons.Refresh disableGroupHover className="w-4 h-4 text-primary-900 stroke-2" />
                </>
              )}
            </div>
          </Button>
        </div>
      </Link>
    </motion.div>
  );
}
