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
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Text } from "../../shared/Text";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { name: "Mailbox", icon: Mail, href: "/mailbox" },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
  { name: "Reports", icon: FileText, href: "/reports" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [activeTheme, setActiveTheme] = useState("light");
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-16 h-[calc(100vh-64px)] overflow-x-hidden",
        "flex flex-col p-2 border-r border-primary-100 bg-[#F8FAFD] transition-all duration-300",
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
          <Text size={"sm"} font={"medium"}>
            Navigation
          </Text>
        )}
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-full"
        >
          <Menu className="w-5 h-5 cursor-pointer text-primary  hover:bg-primary-100 hover:rounded-full transition-transform" />
        </Button>
      </div>

      <Button
        size={"lg"}
        className={cn(
          "bg-[#BBFF14] hover:bg-[#c8f557] transition-all overflow-hidden",
          isCollapsed ? "p-0 h-12 w-12 mx-auto" : "px-4",
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
      <nav className="space-y-2 flex-1 mt-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : ""}
              className={cn(
                "flex items-center rounded-sm transition-all group mx-auto",
                isCollapsed
                  ? "justify-center w-10 h-10"
                  : "justify-between px-3 py-2",
                isActive
                  ? "bg-primary-100 text-primary"
                  : "text-primary-600 hover:text-primary hover:bg-primary-100",
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "w-5 h-5 min-w-5 transition-all",
                    isActive
                      ? "text-primary"
                      : "text-primary-600 group-hover:text-primary",
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />

                {!isCollapsed && (
                  <Text as={"span"} font={isActive ? "medium" : "default"}>
                    {item.name}
                  </Text>
                )}
              </div>

              {!isCollapsed && (
                <ChevronRight
                  className={cn(
                    "w-4 h-4 transition-transform",
                    isActive
                      ? "text-primary translate-x-1"
                      : "text-primary-700",
                  )}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Theme Switcher */}
      <hr className="bg-primary-100 mb-4" />
      <div
        className={cn(
          "w-full p-1 rounded-lg bg-primary-100 flex flex-col gap-2 transition-all",
          isCollapsed ? "h-22" : "h-12 flex-row",
        )}
      >
        <button
          onClick={() => setActiveTheme("light")}
          className={cn(
            "flex items-center justify-center gap-2 flex-1 h-10 rounded-lg transition-all cursor-pointer text-sm font-medium",
            activeTheme === "light"
              ? "bg-background text-primary shadow-sm"
              : "text-primary-600",
          )}
        >
          <Sun size={18} />
          {!isCollapsed && "Light"}
        </button>

        <button
          onClick={() => setActiveTheme("dark")}
          className={cn(
            "flex items-center justify-center gap-2 flex-1 h-10 rounded-lg transition-all cursor-pointer text-sm font-medium hover:bg-background",
            activeTheme === "dark"
              ? "bg-background text-primary shadow-sm"
              : "text-primary-600",
          )}
        >
          <Moon size={18} />
          {!isCollapsed && "Dark"}
        </button>
      </div>
      <hr className="bg-primary-100 mt-4" />
      <Text
        font={"medium"}
        color={"primary-600"}
        className={cn(
          "mt-4 px-2 pt-4 text-left",
          isCollapsed ? "text-[10px]" : "text-sm",
        )}
      >
        {!isCollapsed ? "Version 1.0.1" : "V 1.0.1"}
      </Text>
    </aside>
  );
};
