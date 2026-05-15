"use client";
import { useNotifications } from "@/APIs/hooks/notifications";
import { Text } from "@/_components/shared/Text";
import { formatDistanceToNow } from "date-fns";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Notification } from "@/APIs/types/Notification";

import { Icons } from "@/constants/icons";

import { RecentSecurityEventsSkeleton } from "../skeleton/RecentSecurityEventsSkeleton";
import { StateMessage } from "@/_components/shared/StateMessage";

const getSeverity = (notification: Notification) => {
  if (notification.type === "NEW_LOGIN_DETECTED") return "HIGH";
  if (notification.metadata?.verdict === "PHISHING") return "HIGH";
  if (notification.metadata?.verdict === "SPAM") return "MEDIUM";
  return "INFO";
};

const getEventIcon = (notification: Notification) => {
  if (notification.type === "NEW_LOGIN_DETECTED")
    return { icon: Icons.Lock, color: "text-error-500", bg: "bg-error-50" };
  if (notification.metadata?.verdict === "PHISHING")
    return {
      icon: Icons.Phishing,
      color: "text-secondary-50",
      bg: "bg-secondary-500",
    };
  if (notification.metadata?.verdict === "SPAM")
    return {
      icon: Icons.Spam,
      color: "text-warning-500",
      bg: "bg-warning-50",
    };
  return { icon: Info, color: "text-error-500", bg: "bg-error-50" };
};

export const RecentSecurityEvents = () => {
  const { data: notificationsData, isLoading } = useNotifications(1);

  const notifications = Array.isArray(notificationsData?.data?.data)
    ? notificationsData.data.data
    : Array.isArray(notificationsData?.data)
      ? notificationsData.data
      : [];

  const recentEvents = notifications.slice(0, 3);

  if (isLoading) {
    return <RecentSecurityEventsSkeleton />;
  }

  return (
    <div className="flex flex-col gap-8 p-6 bg-background border border-primary-100 rounded-lg h-full">
      <Text size="lg" font="bold" className="mb-2">
        Recent Security Events
      </Text>

      <div className="flex flex-col gap-4">
        {recentEvents.length > 0 ? (
          recentEvents.map((event, index) => {
            const severity = getSeverity(event);
            const { icon: Icon, color, bg } = getEventIcon(event);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.01,
                  x: 8,
                }}
                whileTap={{ scale: 0.99 }}
                transition={{
                  layout: { duration: 0.2 },
                  delay: index * 0.1,
                }}
                className="flex items-start justify-between p-4 rounded-xl bg-ghostBlue cursor-pointer border border-transparent hover:border-primary-100/50 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-2.5 rounded-lg shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                      bg,
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        typeof color === "string" && color.startsWith("text-")
                          ? color
                          : "",
                      )}
                      style={
                        typeof color === "string" && !color.startsWith("text-")
                          ? { color }
                          : {}
                      }
                    />
                  </div>
                  <div className="flex flex-col min-w-0 pt-0.5">
                    <Text size="sm" font="medium">
                      {event.title}
                    </Text>
                    <Text size="xs" color="primary-500" className="mt-1">
                      {event.metadata?.ipAddress
                        ? `IP: ${event.metadata.ipAddress} • Location: Unknown`
                        : event.metadata?.subject
                          ? `Subject: ${event.metadata.subject}`
                          : event.message.length > 35
                            ? event.message.slice(0, 35) + "..."
                            : event.message}
                    </Text>
                    <Text size="xs" color="primary-300" className="mt-2">
                      {formatDistanceToNow(new Date(event.createdAt), {
                        addSuffix: true,
                      })}
                    </Text>
                  </div>
                </div>

                <div
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest pt-1 transition-all duration-300 group-hover:scale-110 group-hover:translate-x-[-4px]",
                    severity === "HIGH"
                      ? "text-error-500"
                      : severity === "MEDIUM"
                        ? "text-warning-600"
                        : "text-secondary-800",
                  )}
                >
                  {severity}
                </div>
              </motion.div>
            );
          })
        ) : (
          <StateMessage
            icon={Icons.Reports}
            title="No security events detected"
            description="You're all clear! No suspicious activity has been detected in your inbox recently."
            variant="empty"
            iconSize={48}
          />
        )}
      </div>
    </div>
  );
};
