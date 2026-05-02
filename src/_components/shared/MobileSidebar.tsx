"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Mail,
  BarChart3,
  FileText,
  Settings,
  Menu,
  PencilLine,
  ChevronRight,
  X,
  Send,
  Star,
  AlertCircle,
  ShieldCheck,
  LineChart,
  Ghost,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Text } from "./Text";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggler from "@/_components/ThemeToggler";
import type { Folder } from "@/types/mail";
import { useMailStore } from "@/stores/useMailStore";

const dashboardNavItems = [
  { name: "Mailboxes", icon: Mail, href: "/mailboxes" },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
  { name: "Reports", icon: FileText, href: "/reports" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

const mailboxNavItems: {
  name: string;
  icon: React.ElementType;
  folder: Folder;
}[] = [
  { name: "Inbox", icon: Mail, folder: "inbox" },
  { name: "Sent", icon: Send, folder: "sent" },
  { name: "Starred", icon: Star, folder: "starred" },
  { name: "Spam", icon: AlertCircle, folder: "spam" },
  { name: "Trash", icon: Trash2, folder: "trash" },
];

const securityNavItems = [
  {
    name: "Security Reports",
    icon: ShieldCheck,
    href: "security-reports",
  },
  { name: "Analytics", icon: LineChart, href: "analytics" },
  { name: "Phishing", icon: Ghost, href: "phishing" },
  { name: "Malware", icon: ShieldAlert, href: "malware" },
];

export const MobileSidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);

  const isMailPage = !!params.mailboxId;
  const setComposeOpen = useMailStore((s) => s.setComposeOpen);

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
                    setTimeout(() => setComposeOpen(true, { mode: "new" }), 150);
                  }}
                >
                  <PencilLine className="w-6 h-6 text-black mr-2" />
                  <Text className="text-black" font={"bold"}>
                    New Email
                  </Text>
                </Button>

                {/* Nav Links */}
                <nav className="space-y-1 flex-1 mt-4 relative">
                  {isMailPage ? (
                    <>
                      {mailboxNavItems.map((item) => {
                        const targetHref = `/mailboxes/${params.mailboxId}/${item.folder}`;
                        const isActive = pathname.startsWith(`/mailboxes/${params.mailboxId}/${item.folder}`);
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
                                color={isActive ? "primary-950" : "primary-600"}
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

                      {/* Divider */}
                      <div className="mt-2 border-t border-primary-100 mx-2" />

                      {/* Security Navigation */}
                      {securityNavItems.map((item) => {
                        const targetHref = `/mailboxes/${params.mailboxId}/${item.href}`;
                        const isActive = pathname.startsWith(`/mailboxes/${params.mailboxId}/${item.href}`);
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
                                color={isActive ? "primary-950" : "primary-600"}
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
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
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
                              color={isActive ? "primary-950" : "primary-600"}
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
                    })
                  )}
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
