"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Text } from "./Text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationCardSkeleton } from "@/_components/skeleton/NotificationSkeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Icons } from "@/constants/icons";
import { MOCK_NOTIFICATIONS } from "@/app/(main)/notifications/MOCKDATA";
import { Notification } from "@/APIs/types/Notification";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StateMessage } from "./StateMessage";

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

export const NotificationDropdown = () => {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<Notification[]>(
    MOCK_NOTIFICATIONS.data,
  );
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification deleted");
  };

  const handleToggleReadStatus = (id: number, currentStatus: boolean) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !currentStatus } : n)),
    );
    toast.success(
      currentStatus
        ? "Notification marked as unread"
        : "Notification marked as read",
    );
  };

  const allRead =
    notifications.length > 0 && notifications.every((n) => n.isRead);

  const handleToggleAllRead = () => {
    const newStatus = !allRead;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: newStatus })));
    toast.success(
      newStatus
        ? "All notifications marked as read"
        : "All notifications marked as unread",
    );
  };

  const renderNotificationCard = (notification: Notification) => {
    const isUnread = !notification.isRead;

    const content = (
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <NotificationIcon type={notification.type} />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Text font="semiBold" size="sm">
                {notification.title}
              </Text>
            </div>
            <div className="relative flex items-center justify-end min-w-[70px]">
              <div className="absolute inset-0 flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-primary hover:text-primary hover:bg-primary/10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleToggleReadStatus(
                      notification.id,
                      notification.isRead,
                    );
                  }}
                >
                  {notification.isRead ? (
                    <Icons.Mail className="h-3.5 w-3.5" />
                  ) : (
                    <CheckCheck className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-6 w-6 text-error-500 hover:text-error-600"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(notification.id);
                  }}
                >
                  <Icons.Delete className="h-3.5 w-3.5 text-error-500 hover:scale-105 transition-transform" />
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
            size="xs"
            color="primary-500"
            className="leading-relaxed line-clamp-2 pr-2"
          >
            {notification.message}
          </Text>
        </div>
      </div>
    );

    return (
      <div
        key={notification.id}
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon-sm"
          variant="ghost"
          className={cn(
            "relative text-primary-600 data-[state=open]:bg-primary-200 data-[state=open]:text-primary hover:bg-primary-50",
            pathname.includes("/notification") && "bg-primary-200 text-primary",
          )}
        >
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center text-[10px] rounded-full bg-error-600 border-none">
              {unreadCount}
            </Badge>
          )}
          <Bell className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[380px] p-0 bg-background border-primary-100 rounded-xl shadow-lg overflow-hidden"
      >
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <Text font="bold" size="lg">
              Notifications
            </Text>
            <button
              className="text-xs text-primary hover:text-primary hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleAllRead();
              }}
            >
              {allRead ? "Mark all as unread" : "Mark all as read"}
            </button>
          </div>

          <div className="px-4 pt-2">
            <TabsList className="w-full grid grid-cols-4 bg-transparent h-auto p-0 gap-1">
              {["all", "threats", "updates", "system"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className={cn(
                    "relative h-9 rounded-md transition-all duration-200 capitalize cursor-pointer",
                    "data-[state=active]:bg-transparent data-[state=active]:text-primary",
                    "hover:bg-primary-50/50",
                    activeTab === tab ? "text-primary" : "text-primary-600",
                  )}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTabDropdown"
                      className="absolute inset-0 bg-primary-100 rounded-md -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + isLoading}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value={activeTab} className="m-0 mt-2">
                <ScrollArea className="h-[400px]">
                  {isLoading ? (
                    <div className="flex flex-col p-4 space-y-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <NotificationCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : notifications.filter((n) =>
                      activeTab === "all" ? true : n.category === activeTab,
                    ).length > 0 ? (
                    <div className="flex flex-col">
                      {notifications
                        .filter((n) =>
                          activeTab === "all" ? true : n.category === activeTab,
                        )
                        .map(renderNotificationCard)}
                    </div>
                  ) : (
                    <div className="h-[400px] flex items-center justify-center">
                      <StateMessage
                        variant="empty"
                        title={`No ${activeTab === "all" ? "" : activeTab} notifications found`}
                        description="You're all caught up!"
                      />
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
