"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Text } from "./shared/Text";
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
import { usePathname } from "next/navigation";
import { StateMessage } from "./shared/StateMessage";
import { NotificationCard } from "./NotificationCard";
import { Bell } from "lucide-react";
import { ActionButton } from "./shared/ActionButton";
import {
  useNotifications,
  useUnreadCount,
  useReadNotification,
  useReadAllNotifications,
  useDeleteNotification,
} from "@/APIs/hooks/notifications";

import notFoundImg from "../../public/images/not-found.png";
import { Notification } from "@/APIs/types/Notification";

export const NotificationDropdown = () => {
  const pathname = usePathname();
  const { data: notificationsData, isLoading: notificationsLoading } =
    useNotifications(1);
  const { data: unreadData } = useUnreadCount();
  const { mutate: readNotification } = useReadNotification();
  const { mutate: readAll } = useReadAllNotifications();
  const { mutate: deleteNotification } = useDeleteNotification();

  const notifications = useMemo(() => {
    return Array.isArray(notificationsData?.data?.data)
      ? notificationsData.data.data
      : Array.isArray(notificationsData?.data)
        ? notificationsData.data
        : Array.isArray(notificationsData)
          ? notificationsData
          : [];
  }, [notificationsData]);

  const unreadCount = unreadData?.count || 0;

  const handleToggleReadStatus = (id: number, currentStatus: boolean) => {
    if (!currentStatus) {
      readNotification(String(id));
    } else {
      toast("Notification already read");
    }
  };

  const [activeTab, setActiveTab] = useState("all");

  // Memoize filtered notifications to avoid recomputing on every render
  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications;
    return notifications.filter((n) => {
      const category =
        n.type === "NEW_EMAIL_RECEIVED"
          ? n.metadata?.verdict === "SPAM"
            ? "threats"
            : "updates"
          : "system";
      return category === activeTab;
    });
  }, [notifications, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleToggleAllRead = () => {
    readAll();
  };

  const isLoading = notificationsLoading;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <div className="inline-block relative">
          <ActionButton
            icon={<Bell className="w-5 h-5" />}
            label="Notifications"
            tooltipSide="bottom"
            onClick={() => {}}
            className={cn(
              "text-primary-600",
              pathname.includes("/notification") &&
                "bg-primary-200 text-primary",
            )}
          />
          {unreadCount > 0 && (
            <Badge className="absolute -top-0.5 right-0 w-4 h-4  flex items-center justify-center text-[8px] rounded-full bg-primary border-none pointer-events-none z-10">
              {unreadCount}
            </Badge>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[440px] p-0 bg-background border-primary-100 rounded-xl shadow-lg overflow-hidden"
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
              {unreadCount > 0 && (
                <span className="ml-2 text-xs font-normal text-primary-600">
                  ({unreadCount} unread)
                </span>
              )}
            </Text>
            <button
              className="text-xs text-primary-600 hover:text-primary hover:underline cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleAllRead();
              }}
            >
              Mark all as read
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
                <ScrollArea className="h-[400px] w-full overflow-x-hidden">
                  {isLoading ? (
                    <div className="flex flex-col p-4 space-y-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <NotificationCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : filteredNotifications.length > 0 ? (
                    <div className="flex flex-col">
                      {filteredNotifications.map(
                        (notification: Notification) => (
                          <NotificationCard
                            key={notification.id}
                            notification={notification}
                            onDelete={() =>
                              deleteNotification(String(notification.id))
                            }
                            onToggleRead={handleToggleReadStatus}
                          />
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="h-[400px] flex items-center justify-center">
                      <StateMessage
                        variant="empty"
                        icon={Bell}
                        title={`No ${activeTab === "all" ? "" : activeTab} notifications`}
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
