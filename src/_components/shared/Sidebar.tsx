"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, PencilLine, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ThemeToggler from "@/_components/ThemeToggler";
import { useMailStore } from "@/stores/useMailStore";
import { useUnreadCount } from "@/APIs/hooks/notifications";
import {
  dashboardNavItems,
  mailboxNavItems,
  securityNavItems,
} from "@/constants";
import { Icons } from "@/constants/icons";
import { User, LogOut } from "lucide-react";
import { useLogout } from "@/APIs/hooks/auth";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export const Sidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const setComposeOpen = useMailStore((s) => s.setComposeOpen);
  const isMailPage = !!params.mailboxId;
  const { data: unreadCount } = useUnreadCount();
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
    logout();
  };

  return (
    <aside
      className={cn(
        "sticky top-16 h-[calc(100vh-64px)] overflow-x-hidden bg-ghostBlue",
        "hidden md:flex flex-col border-r border-primary-100 py-2 px-2.5 transition-[width,padding] duration-200",
        "h-full overflow-y-auto scrollbar-slim",
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
          <Text size={"sm"} font={"medium"} color={"default"}>
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

      {isMailPage && (
        <Button
          onClick={() => setComposeOpen(true, { mode: "new" })}
          size={"lg"}
          className={cn(
            "overflow-hidden bg-secondary-400 text-primary transition-colors hover:bg-secondary-600 mb-2",
            isCollapsed ? "mx-auto h-12 w-12 p-0" : "px-4",
          )}
        >
          <PencilLine
            className={cn("w-6 h-6 text-primary-900", !isCollapsed && "mr-2")}
          />
          {!isCollapsed && (
            <Text font={"bold"}>
              New Email
            </Text>
          )}
        </Button>
      )}
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
                  title={isCollapsed ? item.name : ""}
                  className={cn(
                    "flex items-center rounded-sm transition-colors duration-200 group mx-auto relative w-full",
                    isCollapsed
                      ? "justify-center w-10 h-10"
                      : "justify-between px-3 py-2",
                    isActive
                      ? "text-primary"
                      : "text-primary-900 hover:bg-primary-100 hover:text-primary",
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

                  <div className="flex items-center gap-2">
                    <item.icon
                      active={isActive}
                      className="w-[22px] h-[22px] min-w-[22px]"
                    />
                    {!isCollapsed && (
                      <div className="flex items-center gap-1">
                        <Text
                          as={"span"}
                          font={isActive ? "medium" : "default"}
                          color={isActive ? "default" : "muted"}
                        >
                          {item.name}
                        </Text>
                        {item.folder === "inbox" &&
                          (unreadCount?.count ?? 0) > 0 && (
                            <span className="bg-primary text-background flex items-center justify-center  px-0.5 text-[10px] font-medium rounded-xs">
                              {unreadCount?.count}
                            </span>
                          )}
                      </div>
                    )}
                  </div>

                  {!isCollapsed && (
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform",
                        isActive
                          ? "translate-x-1 text-primary"
                          : "text-muted",
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
              const isActive = pathname.startsWith(
                `/mailboxes/${params.mailboxId}/${item.href}`,
              );
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
                        color={isActive ? "default" : "muted"}
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
                          : "text-muted",
                      )}
                    />
                  )}
                </Link>
              );
            })}

            {/* Settings Link */}
            <Link
              href={`/mailboxes/${params.mailboxId}/settings`}
              title={isCollapsed ? "Settings" : ""}
              className={cn(
                "flex items-center rounded-sm transition-colors duration-200 group mx-auto relative w-full",
                isCollapsed
                  ? "justify-center w-10 h-10"
                  : "justify-between px-3 py-2",
                pathname.includes("/settings")
                  ? "text-primary"
                  : "text-default hover:bg-primary-100 hover:text-primary",
              )}
            >
              {pathname.includes("/settings") && (
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
                <Icons.Settings
                  active={pathname.includes("/settings")}
                  className="w-[22px] h-[22px] min-w-[22px]"
                />
                {!isCollapsed && (
                  <Text
                    as={"span"}
                    font={pathname.includes("/settings") ? "medium" : "default"}
                    color={pathname.includes("/settings") ? "default" : "muted"}
                  >
                    Settings
                  </Text>
                )}
              </div>

              {!isCollapsed && (
                <ChevronRight
                  className={cn(
                    "w-4 h-4 transition-transform",
                    pathname.includes("/settings")
                      ? "translate-x-1 text-primary"
                      : "text-muted",
                  )}
                />
              )}
            </Link>
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
                      color={isActive ? "default" : "muted"}
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
                        : "text-muted",
                    )}
                  />
                )}
              </Link>
            );
          })
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto pt-4 flex flex-col gap-1 border-t border-primary-100/50">
        {/* Profile Link */}
        <Link
          href="/profile"
          title={isCollapsed ? "Profile" : ""}
          className={cn(
            "flex items-center rounded-sm transition-colors duration-200 group mx-auto relative w-full",
            isCollapsed ? "justify-center w-10 h-10" : "justify-between px-3 py-2",
            pathname === "/profile"
              ? "text-primary"
              : "text-primary-600 hover:bg-primary-100 hover:text-primary",
          )}
        >
          {pathname === "/profile" && (
            <motion.div
              layoutId="activeNavIndicator"
              className="absolute inset-0 -z-10 rounded-sm bg-primary-100"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <div className="flex items-center gap-3">
            <User className={cn("w-[22px] h-[22px]", pathname === "/profile" ? "text-primary" : "text-primary-400")} />
            {!isCollapsed && (
              <Text
                as={"span"}
                font={pathname === "/profile" ? "medium" : "default"}
                color={pathname === "/profile" ? "default" : "muted"}
              >
                Profile
              </Text>
            )}
          </div>
          {!isCollapsed && (
            <ChevronRight
              className={cn(
                "w-4 h-4 transition-transform",
                pathname === "/profile" ? "translate-x-1 text-primary" : "text-muted",
              )}
            />
          )}
        </Link>

        {/* Logout Button */}
        <button
          onClick={() => handleLogout()}
          disabled={isLoggingOut}
          title={isCollapsed ? "Logout" : ""}
          className={cn(
            "flex items-center rounded-sm transition-colors duration-200 group mx-auto relative w-full",
            isCollapsed ? "justify-center w-10 h-10" : "justify-between px-3 py-2",
            "text-error-500 hover:bg-error-50",
          )}
        >
          <div className="flex items-center gap-3">
            {isLoggingOut ? (
              <Spinner className="w-5 h-5 text-error-500" />
            ) : (
              <LogOut className="w-[22px] h-[22px] text-error-500" />
            )}
            {!isCollapsed && (
              <Text as={"span"} color="error-500">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Text>
            )}
          </div>
        </button>
      </div>

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
