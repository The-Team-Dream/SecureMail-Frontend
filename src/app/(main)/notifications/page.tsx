"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Notification } from "@/APIs/types/Notification";
import { MOCK_NOTIFICATIONS } from "./MOCKDATA";
import Container from "@/_components/shared/Container";
import { cn } from "@/lib/utils";
import {
  NotificationCardSkeleton,
  NotificationPageSkeleton,
} from "@/_components/skeleton/NotificationSkeleton";
import { Icons } from "@/constants/icons";
import { NotificationCard } from "@/_components/NotificationCard";

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(
    MOCK_NOTIFICATIONS.data,
  );
  const [currentPage, setCurrentPage] = useState(MOCK_NOTIFICATIONS.page);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

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

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const ITEMS_PER_PAGE = 10;
  const filteredNotifications = notifications.filter((n) =>
    activeTab === "all" ? true : n.category === activeTab,
  );

  const totalItems = filteredNotifications.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentData = filteredNotifications.slice(startIndex, endIndex);

  if (isLoading) return <NotificationPageSkeleton />;

  return (
    <Container>
      <header className="flex flex-wrap items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Text as="h1" size="2xl" font="bold">
              Notifications
            </Text>
          </div>
          <Text size="sm" color="primary-400">
            Manage your alerts and secure message activity.
          </Text>
        </div>
        <Button size="sm" className="w-fit" onClick={handleToggleAllRead}>
          {allRead ? "Mark all as unread" : "Mark all as read"}
        </Button>
      </header>
      <Tabs
        value={activeTab}
        className="w-full"
        onValueChange={handleTabChange}
      >
        <div className="mb-8">
          <TabsList className="bg-ghostBlue/50 h-auto p-1 gap-1 border border-primary-100 rounded-lg">
            {["all", "threats", "updates", "system"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={cn(
                  "relative px-6 py-2 rounded-md transition-all duration-300 capitalize min-w-[100px]",
                  "data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none",
                  "hover:text-primary transition-colors",
                  activeTab === tab ? "text-primary" : "text-primary-600",
                )}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabPage"
                    className="absolute inset-0 bg-white shadow-sm border border-primary-100 rounded-md -z-10"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <Text
                  font={activeTab === tab ? "semiBold" : "default"}
                  size="sm"
                >
                  {tab}
                </Text>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + isLoading}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value={activeTab} className="m-0">
              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <NotificationCardSkeleton key={i} />
                  ))
                ) : currentData.length > 0 ? (
                  currentData.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onDelete={handleDelete}
                      onToggleRead={handleToggleReadStatus}
                      variant="page"
                    />
                  ))
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-primary-200">
                    <Icons.Inbox className="w-12 h-12 text-primary-200 mb-4" />
                    <Text font="semiBold" size="lg" color="primary-900">
                      No {activeTab === "all" ? "" : activeTab} notifications
                    </Text>
                    <Text size="sm" color="primary-500">
                      You're all caught up for today!
                    </Text>
                  </div>
                )}
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>

      {/* Pagination Container */}
      <footer className="flex items-center justify-between mt-10 pt-6 border-t">
        <Text size="sm" color="primary-500">
          Showing{" "}
          <Text as={"span"} font={"medium"}>
            {totalItems === 0 ? 0 : startIndex + 1}-{endIndex}
          </Text>{" "}
          of{" "}
          <Text as={"span"} font={"medium"}>
            {totalItems}
          </Text>{" "}
          results
        </Text>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center px-4 rounded-md border text-sm font-medium">
            <input
              className="w-4 border-none focus:outline-none text-center"
              type="text"
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              min={1}
              max={totalPages}
            />
            / {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage >= totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </footer>
    </Container>
  );
};

export default Notifications;
