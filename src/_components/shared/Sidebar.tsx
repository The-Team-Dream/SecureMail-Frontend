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
} from "@/constants/Sidebar";
import { Icons } from "@/constants/icons";
import { User, LogOut } from "lucide-react";
import { useLogout } from "@/APIs/hooks/auth";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { ActionButton } from "@/_components/shared/ActionButton";
import {
  useEmails,
  useReclassifyEmail,
  useStarEmail,
} from "@/APIs/hooks/emails";
import type { EmailFolder } from "@/APIs/types/Email";

export const Sidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const setComposeOpen = useMailStore((s) => s.setComposeOpen);
  const isMailPage = !!params.mailboxId;
  const { data: unreadCount } = useUnreadCount();
  const { data: inboxData } = useEmails(params.mailboxId as string, "inbox", 1);
  const unreadInboxCount =
    inboxData?.data?.filter((e: any) => !e.isRead).length || 0;
  const router = useRouter();

  const [activeDropFolder, setActiveDropFolder] = useState<string | null>(null);
  const reclassifyMutation = useReclassifyEmail(String(params.mailboxId));
  const starMutation = useStarEmail(String(params.mailboxId));

  const handleDropEmail = (emailId: string, folder: string) => {
    if (folder === "starred") {
      starMutation.mutate({ id: emailId, starred: true });
    } else {
      reclassifyMutation.mutate({ id: emailId, folder: folder as EmailFolder });
    }
  };

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
        <ActionButton
          icon={<Menu className="w-5 h-5 text-primary" />}
          label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          tooltipSide="right"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-md w-8 h-8 text-primary hover:bg-primary-100"
        />
      </div>

      {isMailPage &&
        (isCollapsed ? (
          <div className="flex justify-center mb-2">
            <ActionButton
              icon={<PencilLine className="w-6 h-6 text-primary-900" />}
              label="New Email"
              tooltipSide="right"
              onClick={() => setComposeOpen(true, { mode: "new" })}
              className="rounded-lg w-12 h-12 bg-secondary-400 hover:bg-secondary-600 text-primary-900 flex items-center justify-center"
            />
          </div>
        ) : (
          <Button
            onClick={() => setComposeOpen(true, { mode: "new" })}
            size={"lg"}
            className="overflow-hidden bg-secondary-400 text-primary transition-colors hover:bg-secondary-600 mb-2 px-4"
          >
            <PencilLine className="w-6 h-6 text-primary-900 mr-2" />
            <Text font={"bold"}>New Email</Text>
          </Button>
        ))}

      {/* Nav Links */}
      <nav className="space-y-1 flex-1 mt-4 relative">
        {isMailPage ? (
          <>
            {mailboxNavItems.map((item) => {
              const targetHref = `/mailboxes/${params.mailboxId}/${item.folder}`;
              const isActive = pathname.startsWith(
                `/mailboxes/${params.mailboxId}/${item.folder}`,
              );
              const isDragActive = activeDropFolder === item.folder;

              const dragProps = {
                onDragOver: (e: React.DragEvent) => {
                  e.preventDefault();
                },
                onDragEnter: () => setActiveDropFolder(item.folder),
                onDragLeave: () => setActiveDropFolder(null),
                onDrop: (e: React.DragEvent) => {
                  e.preventDefault();
                  setActiveDropFolder(null);
                  const emailId = e.dataTransfer.getData("text/plain");
                  if (emailId) {
                    handleDropEmail(emailId, item.folder);
                  }
                },
              };

              if (isCollapsed) {
                return (
                  <div
                    key={item.name}
                    className={cn(
                      "flex justify-center transition-all duration-200",
                      isDragActive &&
                        "scale-110 bg-primary-100/50 rounded-lg p-0.5 border-2 border-dashed border-primary",
                    )}
                    {...dragProps}
                  >
                    <ActionButton
                      href={targetHref}
                      label={item.name}
                      tooltipSide="right"
                      icon={
                        <item.icon
                          active={isActive}
                          disableFill={true}
                          className="w-[22px] h-[22px] min-w-[22px]"
                        />
                      }
                      className={cn(
                        "rounded-sm w-10 h-10",
                        isActive
                          ? "bg-primary-100 text-primary"
                          : "text-primary-900 hover:bg-primary-100 hover:text-primary",
                      )}
                    />
                  </div>
                );
              }

              return (
                <div key={item.name} {...dragProps} className="w-full">
                  <Link
                    href={targetHref}
                    className={cn(
                      "flex items-center rounded-sm transition-colors duration-200 group mx-auto relative w-full",
                      "justify-between px-3 py-2",
                      isActive
                        ? "text-primary"
                        : "text-primary-900 hover:bg-primary-100 hover:text-primary",
                      isDragActive &&
                        "bg-primary-100 border-2 border-dashed border-primary scale-[1.02] shadow-sm",
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
                        disableFill={true}
                        className="w-[22px] h-[22px] min-w-[22px]"
                      />
                      <div className="flex items-center gap-1">
                        <Text
                          as={"span"}
                          font={isActive ? "medium" : "default"}
                          color={isActive ? "primary-950" : "muted"}
                        >
                          {item.name}
                        </Text>
                        {item.folder === "inbox" &&
                          (unreadInboxCount ?? 0) > 0 && (
                            <span className="bg-primary text-background flex items-center justify-center px-1 text-[10px] font-medium rounded-xs">
                              {unreadInboxCount}
                            </span>
                          )}
                      </div>
                    </div>

                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform",
                        isActive ? "translate-x-1 text-primary" : "text-muted",
                      )}
                    />
                  </Link>
                </div>
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
              const isDropTarget =
                item.href === "phishing" || item.href === "malware";
              const isDragActive =
                isDropTarget && activeDropFolder === item.href;

              const dragProps = isDropTarget
                ? {
                    onDragOver: (e: React.DragEvent) => {
                      e.preventDefault();
                    },
                    onDragEnter: () => setActiveDropFolder(item.href),
                    onDragLeave: () => setActiveDropFolder(null),
                    onDrop: (e: React.DragEvent) => {
                      e.preventDefault();
                      setActiveDropFolder(null);
                      const emailId = e.dataTransfer.getData("text/plain");
                      if (emailId) {
                        handleDropEmail(emailId, item.href);
                      }
                    },
                  }
                : {};

              if (isCollapsed) {
                return (
                  <div
                    key={item.name}
                    className={cn(
                      "flex justify-center transition-all duration-200",
                      isDragActive &&
                        "scale-110 bg-primary-100/50 rounded-lg p-0.5 border-2 border-dashed border-primary",
                    )}
                    {...dragProps}
                  >
                    <ActionButton
                      href={targetHref}
                      label={item.name}
                      tooltipSide="right"
                      icon={
                        <item.icon
                          active={isActive}
                          disableFill={true}
                          className="w-[22px] h-[22px] min-w-[22px]"
                        />
                      }
                      className={cn(
                        "rounded-sm w-10 h-10",
                        isActive
                          ? "bg-primary-100 text-primary"
                          : "text-primary-600 hover:bg-primary-100 hover:text-primary",
                      )}
                    />
                  </div>
                );
              }

              return (
                <div key={item.name} {...dragProps} className="w-full">
                  <Link
                    href={targetHref}
                    className={cn(
                      "flex items-center rounded-sm transition-colors duration-200 group mx-auto relative",
                      "justify-between px-3 py-2",
                      isActive
                        ? "text-primary"
                        : "text-primary-600 hover:bg-primary-100 hover:text-primary",
                      isDragActive &&
                        "bg-primary-100 border-2 border-dashed border-primary scale-[1.02] shadow-sm",
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
                        disableFill={true}
                        className="w-[22px] h-[22px] min-w-[22px]"
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
                        isActive ? "translate-x-1 text-primary" : "text-muted",
                      )}
                    />
                  </Link>
                </div>
              );
            })}

          </>
        ) : (
          dashboardNavItems.map((item) => {
            const isActive = pathname === item.href;

            if (isCollapsed) {
              return (
                <div key={item.name} className="flex justify-center">
                  <ActionButton
                    href={item.href}
                    label={item.name}
                    tooltipSide="right"
                    icon={
                      <item.icon
                        active={isActive}
                        disableFill={true}
                        className="w-[22px] h-[22px] min-w-[22px]"
                      />
                    }
                    className={cn(
                      "rounded-sm w-10 h-10",
                      isActive
                        ? "bg-primary-100 text-primary"
                        : "text-primary-600 hover:bg-primary-100 hover:text-primary",
                    )}
                  />
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
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
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 -z-10 rounded-sm bg-primary-100"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <div className="flex items-center gap-3">
                  <item.icon
                    active={isActive}
                    disableFill={true}
                    className="w-[22px] h-[22px] min-w-[22px]"
                  />
                  <Text
                    as={"span"}
                    font={isActive ? "medium" : "default"}
                    color={isActive ? "default" : "muted"}
                  >
                    {item.name}
                  </Text>
                </div>

                <ChevronRight
                  className={cn(
                    "w-4 h-4 transition-transform",
                    isActive ? "translate-x-1 text-primary" : "text-muted",
                  )}
                />
              </Link>
            );
          })
        )}
      </nav>

      <hr className="-m-2 mt-2 h-px bg-primary-100" />

      {/* Bottom Actions */}
      <div className="mt-auto pt-4 flex flex-col gap-1">
        {/* Profile Link */}
        {isCollapsed ? (
          <div className="flex justify-center">
            <ActionButton
              href="/profile"
              label="Profile"
              tooltipSide="right"
              icon={
                <User
                  className={cn(
                    "w-[22px] h-[22px]",
                    pathname === "/profile"
                      ? "text-primary"
                      : "text-primary-400",
                  )}
                />
              }
              className={cn(
                "rounded-sm w-10 h-10",
                pathname === "/profile"
                  ? "bg-primary-100 text-primary"
                  : "text-primary-600 hover:bg-primary-100 hover:text-primary",
              )}
            />
          </div>
        ) : (
          <Link
            href="/profile"
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
                layoutId="activeNavIndicator"
                className="absolute inset-0 -z-10 rounded-sm bg-primary-100"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <div className="flex items-center gap-3">
              <User
                className={cn(
                  "w-[22px] h-[22px]",
                  pathname === "/profile" ? "text-primary" : "text-primary-400",
                )}
              />
              <Text
                as={"span"}
                font={pathname === "/profile" ? "medium" : "default"}
                color={pathname === "/profile" ? "default" : "muted"}
              >
                Profile
              </Text>
            </div>
            <ChevronRight
              className={cn(
                "w-4 h-4 transition-transform",
                pathname === "/profile"
                  ? "translate-x-1 text-primary"
                  : "text-muted",
              )}
            />
          </Link>
        )}

        {/* Logout Button */}
        {isCollapsed ? (
          <div className="flex justify-center">
            <ActionButton
              label={isLoggingOut ? "Logging out..." : "Logout"}
              tooltipSide="right"
              disabled={isLoggingOut}
              variant="danger"
              icon={
                isLoggingOut ? (
                  <Spinner className="w-5 h-5 text-error-500" />
                ) : (
                  <LogOut className="w-[22px] h-[22px] text-error-500" />
                )
              }
              className="rounded-sm w-10 h-10"
              onClick={handleLogout}
            />
          </div>
        ) : (
          <button
            onClick={() => handleLogout()}
            disabled={isLoggingOut}
            className={cn(
              "flex items-center rounded-sm transition-colors duration-200 group mx-auto relative w-full cursor-pointer",
              "justify-between px-3 py-2",
              "text-error-500 hover:bg-error-50",
            )}
          >
            <div className="flex items-center gap-3">
              {isLoggingOut ? (
                <Spinner className="w-5 h-5 text-error-500" />
              ) : (
                <LogOut className="w-[22px] h-[22px] text-error-500" />
              )}
              <Text as={"span"} color="error-500">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Text>
            </div>
          </button>
        )}
      </div>

      <hr className="-m-2 my-2 h-px bg-primary-100" />
      <div className="mt-2">
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
