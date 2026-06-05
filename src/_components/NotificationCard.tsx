"use client";

import { formatDistanceToNow } from "date-fns";
import { Mail, MailOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icons } from "@/constants/icons";
import { Text } from "./shared/Text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Notification } from "@/APIs/types/Notification";
import Image from "next/image";
import logo from "../../public/icons/logo.png";
import { getInitials } from "@/lib/utils";
import { ActionButton } from "./shared/ActionButton";

interface NotificationCardProps {
  notification: Notification;
  onDelete: (id: number) => void;
  onToggleRead: (id: number, currentStatus: boolean) => void;
  variant?: "dropdown" | "page";
}

const NotificationAvatar = ({
  notification,
}: {
  notification: Notification;
}) => {
  const size = "w-10 h-10";
  const imgSize = 22;

  if (notification.type !== "NEW_EMAIL_RECEIVED") {
    return (
      <div
        className={cn(
          size,
          "rounded-full bg-background flex items-center justify-center overflow-hidden border border-primary-100 shadow-sm",
        )}
      >
        <Image src={logo} alt="System" width={imgSize} height={imgSize} />
      </div>
    );
  }

  const senderName =
    notification.metadata?.fromAddr?.split("<")[0]?.replace(/"/g, "").trim() ||
    "System";
  const initials = getInitials(senderName);

  return (
    <div
      className={cn(
        size,
        "rounded-full bg-primary-50 flex items-center justify-center border border-primary-200 shadow-sm",
      )}
    >
      <Text font="bold" size="xs" color={"primary-700"} className="uppercase">
        {initials}
      </Text>
    </div>
  );
};

export const NotificationCard = ({
  notification,
  onDelete,
  onToggleRead,
}: NotificationCardProps) => {
  const isUnread = !notification.isRead;

  const content = (
    <div className={cn("flex items-start gap-3")}>
      <div className="shrink-0">
        <NotificationAvatar notification={notification} />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Text font="semiBold" size="sm" color="default">
              {notification.title}
            </Text>
          </div>
          <div
            className={cn(
              "relative flex items-center justify-end min-w-[70px]",
            )}
          >
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10",
              )}
            >
              <ActionButton
                label={notification.isRead ? "Mark as unread" : "Mark as read"}
                tooltipSide="top"
                onClick={() => {
                  onToggleRead(notification.id, notification.isRead);
                }}
                icon={
                  notification.isRead ? (
                    <Mail className="h-3.5 w-3.5 text-primary-600" />
                  ) : (
                    <MailOpen className="h-3.5 w-3.5 text-primary-600" />
                  )
                }
                className="h-7 w-7 rounded-full text-primary hover:bg-primary-50"
              />

              <ActionButton
                label="Delete"
                tooltipSide="top"
                onClick={() => onDelete(notification.id)}
                icon={
                  <Icons.Delete
                    className="h-3.5 w-3.5 hover:scale-110 transition-transform"
                  />
                }
                className="h-7 w-7 rounded-full text-error-500 hover:bg-error-50"
              />
            </div>
            <div className="opacity-100 group-hover:opacity-0 transition-opacity whitespace-nowrap">
              <Text size="xs" color="muted">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </Text>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Text
            size="xs"
            color="muted"
            className="leading-relaxed line-clamp-2 pr-2"
          >
            {notification.message}
          </Text>

          {notification.metadata && (
            <div className="flex flex-wrap gap-2 mt-1">
              {notification.metadata.fromAddr && (
                <Badge
                  variant="outline"
                  className="text-[10px] py-0 h-4 border-primary-100 bg-primary-50"
                >
                  From: {notification.metadata.fromAddr}
                </Badge>
              )}
              {notification.metadata.verdict && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] py-0 h-4 uppercase",
                    notification.metadata.verdict === "SPAM"
                      ? "border-secondary-800 bg-secondary-50/20 text-secondary-800"
                      : "border-primary-100 bg-primary-50",
                  )}
                >
                  {notification.metadata.verdict}
                </Badge>
              )}
              {notification.metadata.ipAddress && (
                <Badge
                  variant="outline"
                  className="text-[10px] py-0 h-4 border-primary-100 bg-primary-50"
                >
                  IP: {notification.metadata.ipAddress}
                </Badge>
              )}
              {notification.metadata.deviceOs && (
                <Badge
                  variant="outline"
                  className="text-[10px] py-0 h-4 border-primary-100 bg-primary-50"
                >
                  {notification.metadata.deviceOs} /{" "}
                  {notification.metadata.deviceBrowser}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "group relative p-4 border-b last:border-0 transition-colors hover:bg-primary-50/50",
        isUnread ? "bg-primary-50" : "bg-transparent",
        notification.metadata?.verdict === "SPAM" &&
          "border-l-4 border-l-error-500",
      )}
    >
      <div>{content}</div>
    </div>
  );
};
