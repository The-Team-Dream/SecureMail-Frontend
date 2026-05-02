"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  CheckCheck,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Icons } from "@/constants/icons";
import { Text } from "./shared/Text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Notification } from "@/APIs/types/Notification";

interface NotificationCardProps {
  notification: Notification;
  onDelete: (id: number) => void;
  onToggleRead: (id: number, currentStatus: boolean) => void;
  variant?: "dropdown" | "page";
}

const NotificationIcon = ({ type }: { type: string }) => {
  const iconClass = "w-5 h-5";
  switch (type) {
    case "error":
      return <XCircle className={`${iconClass} text-error-500`} />;
    case "warning":
      return <AlertTriangle className={`${iconClass} text-warning-500`} />;
    case "success":
      return <CheckCircle2 className={`${iconClass} text-secondary-700`} />;
    default:
      return <Info className={`${iconClass} text-info-500`} />;
  }
};

export const NotificationCard = ({
  notification,
  onDelete,
  onToggleRead,
  variant = "dropdown",
}: NotificationCardProps) => {
  const isUnread = !notification.isRead;
  const isPage = variant === "page";

  const content = (
    <div className={cn("flex items-start", isPage ? "gap-2" : "gap-3")}>
      <div className={cn(isPage ? "p-1" : "pt-0.5")}>
        <NotificationIcon type={notification.type} />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Text
              font="semiBold"
              size={isPage ? "lg" : "sm"}
              color={isPage ? "secondary-950" : "default"}
            >
              {notification.title}
            </Text>
            {isPage && isUnread && (
              <Badge
                variant="secondary"
                className="h-5 px-1.5 text-[10px] uppercase bg-primary text-background"
              >
                New
              </Badge>
            )}
          </div>
          <div
            className={cn(
              "relative flex items-center justify-end",
              isPage ? "min-w-[80px]" : "min-w-[70px]",
            )}
          >
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10",
                !isPage && "gap-0.5",
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  isPage ? "h-7 w-7" : "h-6 w-6",
                  "text-primary hover:text-primary hover:bg-primary/10",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleRead(notification.id, notification.isRead);
                }}
              >
                {notification.isRead ? (
                  <Icons.Mail className={isPage ? "h-4 w-4" : "h-3.5 w-3.5"} />
                ) : (
                  <CheckCheck className={isPage ? "h-4 w-4" : "h-3.5 w-3.5"} />
                )}
              </Button>
              <Button
                variant="ghost"
                size={isPage ? "icon" : "icon-sm"}
                className={cn(
                  isPage ? "h-7 w-7" : "h-6 w-6",
                  "text-error-500 hover:text-error-600",
                  isPage && "hover:bg-error-50",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
              >
                <Icons.Delete
                  className={cn(
                    isPage ? "h-4 w-4" : "h-3.5 w-3.5",
                    "text-error-500 hover:scale-105 transition-transform",
                  )}
                />
              </Button>
            </div>
            <div className="opacity-100 group-hover:opacity-0 transition-opacity whitespace-nowrap">
              <Text size="xs" color="primary-800">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </Text>
            </div>
          </div>
        </div>

        <Text
          size={isPage ? "sm" : "xs"}
          color={isPage ? "secondary-700" : "primary-500"}
          className={cn(
            "leading-relaxed",
            isPage ? "max-w-[90%]" : "line-clamp-2 pr-2",
          )}
        >
          {notification.message}
        </Text>
      </div>
    </div>
  );

  if (isPage) {
    const MotionCard = motion.create(Card);
    return (
      <MotionCard
        initial={{ boxShadow: "none" }}
        whileHover={{
          boxShadow:
            "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "group relative mb-4 overflow-hidden",
          isUnread ? "bg-primary-50" : "bg-transparent",
          notification.type === "error" && "border-l-error-500",
        )}
      >
        <CardContent className="p-0">
          {notification.link ? (
            <Link
              href={notification.link}
              className="block p-5 focus:outline-none"
            >
              {content}
            </Link>
          ) : (
            <div className="p-5">{content}</div>
          )}
        </CardContent>
      </MotionCard>
    );
  }

  return (
    <div
      className={cn(
        "group relative p-4 border-b last:border-0 transition-colors hover:bg-primary-50/50 cursor-pointer",
        isUnread ? "bg-primary-50/30" : "bg-transparent",
        notification.type === "error" && "border-l-4 border-l-error-500",
      )}
    >
      {notification.link ? (
        <Link href={notification.link} className="block focus:outline-none">
          {content}
        </Link>
      ) : (
        <div>{content}</div>
      )}
    </div>
  );
};
