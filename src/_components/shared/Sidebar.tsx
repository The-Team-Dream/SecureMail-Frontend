"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/constants/icons";
import {
  Settings,
  Menu,
  PencilLine,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Text } from "./Text";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ThemeToggler from "@/_components/ThemeToggler";
import { useMailStore } from "@/stores/useMailStore";
import type { Folder } from "@/types/mail";

const dashboardNavItems = [
  { name: "Mailboxes", icon: Icons.Inbox, href: "/mailboxes" },
  { name: "Analytics", icon: Icons.Analytics, href: "/analytics" },
  { name: "Reports", icon: Icons.Reports, href: "/reports" },
  { name: "Settings", icon: Icons.Settings, href: "/settings" },
];

const mailboxNavItems: {
  name: string;
  icon: React.ElementType;
  folder: Folder;
}[] = [
  { name: "Inbox", icon: Icons.Inbox, folder: "inbox" },
  { name: "Sent", icon: Icons.Sent, folder: "sent" },
  { name: "Star", icon: Icons.Star, folder: "starred" },
  { name: "Spam", icon: Icons.Spam, folder: "spam" },
  
];

const securityNavItems = [
  {
    name: "Security Reports",
    icon: Icons.Reports,
    href: "security-reports",
  },
  { name: "Analytics", icon: Icons.Analytics, href: "analytics" },
  { name: "Phishing", icon: Icons.Phishing, href: "phishing" },
  { name: "Malware", icon: Icons.Malware, href: "malware" },
  { name: "Reclassify", icon: Icons.Reclassify, href: "reclassify" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const setComposeOpen = useMailStore((s) => s.setComposeOpen);

  const isMailPage = !!params.mailboxId;

  return (
    <aside
      className={cn(
        "sticky top-16 h-[calc(100vh-64px)] overflow-x-hidden bg-ghostBlue",
        "hidden md:flex flex-col border-r border-primary-100 py-2 px-2.5 transition-[width,padding] duration-200",
        "h-full overflow-y-auto",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex items-center mb-4 px-2",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        {!isCollapsed && (
          <Text size={"sm"} font={"medium"} color={"primary-950"}>
            Navigation
          </Text>
        )}
        <Button
          size={"icon-sm"}
          variant={"ghost"}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="w-5 h-5 text-primary" />
        </Button>
      </div>

      {/* === New Email === */}
      <Button
        onClick={() => setComposeOpen(true)}
        size={"lg"}
        className={cn(
          "overflow-hidden bg-secondary-400 text-primary transition-colors hover:bg-secondary-600 mb-2",
          isCollapsed ? "mx-auto h-12 w-12 p-0" : "px-4",
        )}
      >
        <PencilLine
          className={cn("w-6 h-6 text-black", !isCollapsed && "mr-2")}
        />
        {!isCollapsed && (
          <Text className="text-black" font={"bold"}>
            New Email
          </Text>
        )}
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
                  title={isCollapsed ? item.name : ""}
                  className={cn(
                    "flex items-center rounded-sm transition-colors duration-200 group mx-auto relative w-full",
                    isCollapsed
                      ? "justify-center w-10 h-10"
                      : "justify-between px-3 py-2",
                    isActive
                      ? "text-primary"
                      : "text-primary-600 hover:bg-primary-100 hover:text-primary",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
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
                      active={isActive}
                      className="w-[22px] h-[22px] min-w-[22px]"
                    />
                    {!isCollapsed && (
                      <Text
                        as={"span"}
                        font={isActive ? "medium" : "default"}
                        color={isActive ? "primary-950" : "primary-600"}
                      >
                        {item.name}
                      </Text>
                    )}
                  </div>

                  {!isCollapsed && (
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform",
                        isActive
                          ? "translate-x-1 text-primary"
                          : "text-primary-600",
                      )}
                    />
                  )}
                </Link>
              );
            })}

            {/* Divider */}
            {!isCollapsed && (
              <div className="mt-2 border-t border-primary-100 mx-2" />
            )}
            {/* Security Navigation */}
            {securityNavItems.map((item) => {
              const targetHref = `/mailboxes/${params.mailboxId}/${item.href}`;
              const isActive = pathname.startsWith(`/mailboxes/${params.mailboxId}/${item.href}`);
              return (
                <Link
                  key={item.name}
                  href={targetHref}
                  title={isCollapsed ? item.name : ""}
                  className={cn(
                    "flex items-center rounded-sm transition-colors duration-200 group mx-auto relative",
                    isCollapsed
                      ? "justify-center w-10 h-10"
                      : "justify-between px-3 py-2",
                    isActive
                      ? "text-primary"
                      : "text-primary-600 hover:bg-primary-100 hover:text-primary",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
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
                      active={isActive}
                      className="w-[22px] h-[22px] min-w-[22px]"
                    />
                    {!isCollapsed && (
                      <Text
                        as={"span"}
                        font={isActive ? "medium" : "default"}
                        color={isActive ? "primary-950" : "primary-600"}
                      >
                        {item.name}
                      </Text>
                    )}
                  </div>

                  {!isCollapsed && (
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform",
                        isActive
                          ? "translate-x-1 text-primary"
                          : "text-primary-600",
                      )}
                    />
                  )}
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
                title={isCollapsed ? item.name : ""}
                className={cn(
                  "flex items-center rounded-sm transition-colors duration-200 group mx-auto relative",
                  isCollapsed
                    ? "justify-center w-10 h-10"
                    : "justify-between px-3 py-2",
                  isActive
                    ? "text-primary"
                    : "text-primary-600 hover:bg-primary-100 hover:text-primary",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 -z-10 rounded-sm bg-primary-100"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <div className="flex items-center gap-3">
                  <item.icon
                    active={isActive}
                    className="w-[22px] h-[22px] min-w-[22px]"
                  />
                  {!isCollapsed && (
                    <Text
                      as={"span"}
                      font={isActive ? "medium" : "default"}
                      color={isActive ? "primary-950" : "primary-600"}
                    >
                      {item.name}
                    </Text>
                  )}
                </div>

                {!isCollapsed && (
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isActive
                        ? "translate-x-1 text-primary"
                        : "text-primary-600",
                    )}
                  />
                )}
              </Link>
            );
          })
        )}
      </nav>

      <div className="mt-4">
        <ThemeToggler isCollapsed={isCollapsed} />
      </div>

      <Text
        font={"medium"}
        color={"muted"}
        size={"sm"}
        className="mt-2 px-2 pt-4 text-left"
      >
        {!isCollapsed ? "Version 1.0.1" : "V 1.0.1"}
      </Text>
    </aside>
  );
};
