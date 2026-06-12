"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, PencilLine, ChevronRight, X, User, LogOut } from "lucide-react";
import { useLogout } from "@/APIs/hooks/auth";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggler from "@/_components/ThemeToggler";
import type { EmailFolder as Folder } from "@/APIs/types/Email";
import { useMailStore } from "@/stores/useMailStore";
import { useEmails } from "@/APIs/hooks/emails";
import {
  dashboardNavItems,
  mailboxNavItems,
  securityNavItems,
} from "@/constants/Sidebar";

export const MobileSidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);

  const isMailPage = !!params.mailboxId;
  const setComposeOpen = useMailStore((s) => s.setComposeOpen);
  const router = useRouter();

  const { mutate: logout, isPending: isLoggingOut } = useLogout({
    onSuccess: () => {
      toast.success("Logged out successfully");
      Cookies.remove("token");
      router.replace("/sign-in");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Logout failed");
    },
  });

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  // Fetch inbox emails for unread count
  const { data: inboxData } = useEmails(params.mailboxId as string, "inbox", 1);
  const unreadInboxCount =
    inboxData?.data?.filter((e: any) => !e.isRead).length || 0;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <>
      <Button
        size={"icon-sm"}
        variant={"ghost"}
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5 text-primary" />
      </Button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 500,
                duration: 0.4,
                damping: 30,
              }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-ghostBlue p-0 flex flex-col shadow-xl border-r border-border"
            >
              <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <Text size={"sm"} font={"medium"} color={"primary-950"}>
                  Navigation
                </Text>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 px-0"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4 text-primary" />
                </Button>
              </div>

              <div className="flex flex-col flex-1 px-2.5 py-2 overflow-y-auto">
                {/* Add Email Button */}
                <Button
                  size={"lg"}
                  className="overflow-hidden bg-secondary-400 text-primary transition-all hover:bg-secondary-600 px-4 mb-4"
                  onClick={() => {
                    setOpen(false);
                    setTimeout(
                      () => setComposeOpen(true, { mode: "new" }),
                      150,
                    );
                  }}
                >
                  <PencilLine className="w-6 h-6 text-primary-900 mr-2" />
                  <Text className="text-primary-900" font={"bold"}>
                    New Email
                  </Text>
                </Button>

                {/* Nav Links */}
                <nav className="space-y-1 flex-1 mt-4 relative">
                  {isMailPage ? (
                    <>
                      {mailboxNavItems.map((item) => {
                        const targetHref = `/mailboxes/${params.mailboxId}/${item.folder}`;
                        const isActive = pathname.startsWith(
                          `/mailboxes/${params.mailboxId}/${item.folder}`,
                        );
                        return (
                          <Link
                            key={item.name}
                            href={targetHref}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center rounded-sm transition-colors duration-200 group mx-auto relative w-full",
                              "justify-between px-3 py-2",
                              isActive
                                ? "text-primary"
                                : "text-primary-600 hover:bg-primary-100 hover:text-primary",
                            )}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="mobileActiveNavIndicator"
                                className="absolute inset-0 -z-10 rounded-sm bg-primary-100"
                                transition={{
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 30,
                                }}
                              />
                            )}

                            <div className="flex items-center gap-3">
                              <item.icon
                                className={cn(
                                  "w-5 h-5 min-w-5 transition-colors",
                                  isActive
                                    ? "text-primary"
                                    : "text-primary-600 group-hover:text-primary-600",
                                )}
                                strokeWidth={isActive ? 2.5 : 2}
                              />
                              <Text
                                as={"span"}
                                font={isActive ? "medium" : "default"}
                                color={isActive ? "primary-950" : "muted"}
                              >
                                {item.name}
                              </Text>
                            </div>
                            {item.folder === "inbox" &&
                              unreadInboxCount > 0 && (
                                <span className="bg-primary text-background flex items-center justify-center px-1 text-[10px] font-medium rounded-xs">
                                  {unreadInboxCount}
                                </span>
                              )}
                          </Link>
                        );
                      })}

                      {/* Divider */}
                      <div className="mt-2 border-t border-primary-100 mx-2" />

                      {/* Security Navigation */}
                      {securityNavItems.map((item) => {
                        const targetHref = `/mailboxes/${params.mailboxId}/${item.href}`;
                        const isActive = pathname.startsWith(
                          `/mailboxes/${params.mailboxId}/${item.href}`,
                        );
                        return (
                          <Link
                            key={item.name}
                            href={targetHref}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center rounded-sm transition-colors duration-200 group mx-auto relative",
                              "justify-between px-3 py-2",
                              isActive
                                ? "text-primary"
                                : "text-primary-600 hover:bg-primary-100 hover:text-primary",
                            )}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="mobileActiveNavIndicator"
                                className="absolute inset-0 -z-10 rounded-sm bg-primary-100"
                                transition={{
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 30,
                                }}
                              />
                            )}

                            <div className="flex items-center gap-3">
                              <item.icon
                                className={cn(
                                  "w-5 h-5 min-w-5 transition-colors",
                                  isActive
                                    ? "text-primary"
                                    : "text-primary-600 group-hover:text-primary-600",
                                )}
                                strokeWidth={isActive ? 2.5 : 2}
                              />
                              <Text
                                as={"span"}
                                font={isActive ? "medium" : "default"}
                                color={isActive ? "primary-950" : "muted"}
                              >
                                {item.name}
                              </Text>
                            </div>

                            <ChevronRight
                              className={cn(
                                "w-4 h-4 transition-transform",
                                isActive
                                  ? "translate-x-1 text-primary"
                                  : "text-primary-600 opacity-0 group-hover:opacity-100",
                              )}
                            />
                          </Link>
                        );
                      })}
                    </>
                  ) : (
                    dashboardNavItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center rounded-sm transition-colors duration-200 group mx-auto relative",
                            "justify-between px-3 py-2",
                            isActive
                              ? "text-primary"
                              : "text-primary-600 hover:bg-primary-100 hover:text-primary",
                          )}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="mobileActiveNavIndicator"
                              className="absolute inset-0 -z-10 rounded-sm bg-primary-100"
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                              }}
                            />
                          )}

                          <div className="flex items-center gap-3">
                            <item.icon
                              className={cn(
                                "w-5 h-5 min-w-5 transition-colors",
                                isActive
                                  ? "text-primary"
                                  : "text-primary-600 group-hover:text-primary-600",
                              )}
                              strokeWidth={isActive ? 2.5 : 2}
                            />
                            <Text
                              as={"span"}
                              font={isActive ? "medium" : "default"}
                              color={isActive ? "primary-950" : "muted"}
                            >
                              {item.name}
                            </Text>
                          </div>

                          <ChevronRight
                            className={cn(
                              "w-4 h-4 transition-transform",
                              isActive
                                ? "x-1 text-primary"
                                : "text-primary-600 opacity-0 group-hover:opacity-100",
                            )}
                          />
                        </Link>
                      );
                    })
                  )}

                  {/* Divider */}
                  <div className="mt-4 pt-4 border-t border-primary-100 flex flex-col gap-1">
                    {/* Profile Link */}
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center rounded-sm transition-colors duration-200 group mx-auto relative w-full",
                        "justify-between px-3 py-2",
                        pathname === "/profile"
                          ? "text-primary"
                          : "text-primary-600 hover:bg-primary-100 hover:text-primary",
                      )}
                    >
                      {pathname === "/profile" && (
                        <motion.div
                          layoutId="mobileActiveNavIndicator"
                          className="absolute inset-0 -z-10 rounded-sm bg-primary-100"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                      <div className="flex items-center gap-3">
                        <User
                          className={cn(
                            "w-5 h-5",
                            pathname === "/profile"
                              ? "text-primary"
                              : "text-primary-400",
                          )}
                        />
                        <Text
                          as={"span"}
                          font={pathname === "/profile" ? "medium" : "default"}
                          color={
                            pathname === "/profile" ? "primary-950" : "muted"
                          }
                        >
                          Profile
                        </Text>
                      </div>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 transition-transform",
                          pathname === "/profile"
                            ? "translate-x-1 text-primary"
                            : "text-primary-600 opacity-0 group-hover:opacity-100",
                        )}
                      />
                    </Link>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className={cn(
                        "flex items-center rounded-sm transition-colors duration-200 group mx-auto relative w-full",
                        "justify-between px-3 py-2 text-error-500 hover:bg-error-50",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {isLoggingOut ? (
                          <Spinner className="w-4 h-4 text-error-500" />
                        ) : (
                          <LogOut className="w-5 h-5 text-error-500" />
                        )}
                        <Text as={"span"} color="error-500">
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </Text>
                      </div>
                    </button>
                  </div>
                </nav>

                <div className="mt-4">
                  <ThemeToggler isCollapsed={false} />
                </div>

                <Text
                  font={"medium"}
                  color={"muted"}
                  size={"sm"}
                  className="mt-2 px-2 pt-4 text-left border-t border-primary-100"
                >
                  Version 1.0.1
                </Text>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
