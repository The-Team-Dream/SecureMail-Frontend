"use client";
import { cn } from "@/lib/utils";
import {
  Mail,
  BarChart3,
  FileText,
  Settings,
  Menu,
  PencilLine,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Text } from "../../shared/Text";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import ThemeToggler from "@/_components/ThemeToggler";
import { useTheme } from "next-themes";

const navItems = [
  { name: "Mailbox", icon: Mail, href: "/mailbox" },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
  { name: "Reports", icon: FileText, href: "/reports" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <aside
      className={cn(
        "sticky top-16 h-[calc(100vh-64px)] overflow-x-hidden bg-ghostBlue",
        "flex flex-col border-r border-primary-100 p-2 transition-all duration-300",
        "h-full overflow-y-auto",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Heading */}
      <div
        className={cn(
          "flex items-center mb-8 px-2",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        {!isCollapsed && (
          <Text size={"sm"} font={"medium"} color={"primary-950"}>
            Navigation
          </Text>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="cursor-pointer rounded-full p-2 transition-transform hover:bg-primary-200"
        >
          <Menu className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Add Email Button */}
      <Button
        size={"lg"}
        className={cn(
          "overflow-hidden bg-secondary-500 text-primary transition-all hover:bg-secondary-600",
          isCollapsed ? "mx-auto h-12 w-12 p-0" : "px-4",
        )}
      >
        <PencilLine
          className={cn("w-6 h-6 text-primary", !isCollapsed && "mr-2")}
        />
        {!isCollapsed && (
          <Text color={"primary-950"} font={"bold"}>
            New Email
          </Text>
        )}
      </Button>

      {/* Nav Links */}
      <nav className="space-y-2 flex-1 mt-8 relative">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : ""}
              className={cn(
                "flex items-center rounded-sm transition-all group mx-auto relative",
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
                    stiffness: 600,
                    damping: 20,
                  }}
                />
              )}

              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "w-5 h-5 min-w-5 transition-all",
                    isActive
                      ? "text-primary"
                      : "text-primary-600 group-hover:text-primary-600",
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
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
      </nav>
      <ThemeToggler isCollapsed={isCollapsed} />

      <Text
        font={"medium"}
        color={"muted"}
        size={"sm"}
        className={cn("mt-4 px-2 pt-4 text-left")}
      >
        {!isCollapsed ? "Version 1.0.1" : "V 1.0.1"}
      </Text>
    </aside>
  );
};
