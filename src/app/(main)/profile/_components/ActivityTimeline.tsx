"use client";
import { Text } from "@/_components/shared/Text";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Icons } from "@/constants/icons";
import { Notification } from "@/APIs/types/Notification";
import { StateMessage } from "@/_components/shared/StateMessage";
import { ShieldCheck, Info, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityTimelineProps {
  activities: Notification[];
}

export const ActivityTimeline = ({ activities }: ActivityTimelineProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "NEW_LOGIN_DETECTED": return { icon: Lock, color: "text-error-500", bg: "bg-error-50" };
      case "PASSWORD_CHANGED": return { icon: ShieldCheck, color: "text-secondary-800", bg: "bg-secondary-50" };
      default: return { icon: Info, color: "text-blue-500", bg: "bg-blue-50" };
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-background border border-primary-100 p-8 shadow-sm">
      <Text size="lg" font="bold">Recent Activity</Text>

      <div className="relative flex flex-col gap-8">
        {/* Vertical Line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-primary-100/50" />

        {activities.length > 0 ? (
          activities.map((activity, index) => {
            const { icon: Icon, color, bg } = getIcon(activity.type);
            return (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-6"
              >
                {/* Timeline Dot/Icon */}
                <div className={cn("relative z-10 p-2 rounded-full border-4 border-background", bg, color)}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex flex-col gap-1 pt-1 flex-1">
                  <div className="flex items-center justify-between">
                    <Text size="sm" font="bold" color="primary-950">{activity.title}</Text>
                    <Text size="xs" color="primary-300">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </Text>
                  </div>
                  <Text size="xs" color="primary-500" className="leading-relaxed">
                    {activity.message}
                  </Text>
                </div>
              </motion.div>
            );
          })
        ) : (
          <StateMessage
            title="No recent activity"
            description="Your recent actions and security logs will appear here."
            variant="empty"
            className="py-12"
          />
        )}
      </div>
    </div>
  );
};
