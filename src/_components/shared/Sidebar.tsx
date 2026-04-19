// ===== الشريط الجانبي (Sidebar) =====
// الشريط اللي على الشمال فيه كل الروابط
//
// 🏠 التغييرات اللي عملناها:
// 1. صلحنا isMailPage عشان يتعرف على مسار /mailbox (كان بيدور على /mails)
// 2. غيرنا روابط الإيميل (Inbox, Sent, Starred, إلخ) من <a href="..."> 
//    لأزرار بتغير الـ state فقط - مفيش تنقل حقيقي بين صفحات
//    ده بيمنع الـ 404 لأن كل حاجة بتحصل في صفحة واحدة
//
// 🏠 تشبيه بـ HTML/CSS:
// بدل ما كل رابط في الـ sidebar يوديك لصفحة HTML مختلفة:
//   <a href="inbox.html">Inbox</a>  ← كان بيحتاج ملف
//   <a href="sent.html">Sent</a>    ← كان بيحتاج ملف
// دلوقتي كل الأزرار بتغير "CSS class" بس:
//   <button onclick="showInbox()">Inbox</button>  ← بيغير display
//   <button onclick="showSent()">Sent</button>    ← بيغير display
"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Mail, BarChart3, FileText, Settings, Menu, PencilLine, ChevronRight,
  Send, Star, AlertCircle, ShieldCheck, LineChart, Ghost, ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Text } from "./Text";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ThemeToggler from "@/_components/ThemeToggler";
import { useMailStore } from "@/stores/useMailStore";
import type { Folder } from "@/types/mail";

// 1. القوائم الأساسية (Main Navigation)
// دي الروابط الرئيسية - كل واحد فيهم صفحة حقيقية
const mainNavItems = [
  { name: "Mailbox", icon: Mail, href: "/mailbox" },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
  { name: "Reports", icon: FileText, href: "/reports" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

// 2. قوائم الإيميل (Mail Navigation)
// دي مش روابط حقيقية - بتغير الـ state بس
// folder: المجلد اللي الزر ده بيمثله
const mailNavItems: {
  name: string;
  icon: React.ElementType;
  folder: Folder;
}[] = [
    { name: "Inbox", icon: Mail, folder: "inbox" },
    { name: "Sent", icon: Send, folder: "sent" },
    { name: "Starred", icon: Star, folder: "starred" },
    { name: "Spam", icon: AlertCircle, folder: "spam" },
  ];

// 3. قوائم الأمان (Security Navigation) - روابط حقيقية
const securityNavItems = [
  { name: "Security Reports", icon: ShieldCheck, href: "/mailbox/security" },
  { name: "Analytics", icon: LineChart, href: "/mailbox/analytics" },
  { name: "Phishing", icon: Ghost, href: "/mailbox/phishing" },
  { name: "Malware", icon: ShieldAlert, href: "/mailbox/malware" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // === جلب المجلد النشط وأفعال المتجر ===
  const activeFolder = useMailStore((s) => s.activeFolder);
  const setActiveFolder = useMailStore((s) => s.setActiveFolder);

  // 🔧 الإصلاح: كان بيتحقق من "/mails" بس الروابط على "/mailbox"
  // دلوقتي بيتحقق من "/mailbox" صح ✅
  const isMailPage = pathname.startsWith("/mails");

  // === لما تضغط على رابط إيميل (Inbox, Sent, إلخ) ===
  // بدل ما يروح لصفحة جديدة (ويطلع 404)
  // بيغير المجلد في المتجر وبيروح لصفحة inbox
  const handleMailNavClick = (folder: Folder) => {
    setActiveFolder(folder);
    // لو مش في صفحة inbox → روح ليها
    if (!pathname.startsWith("/mailbox/inbox")) {
      router.push("/mailbox/inbox");
    }
  };

  return (
    <aside
      className={cn(
        "sticky top-16 h-[calc(100vh-64px)] overflow-x-hidden bg-ghostBlue",
        "hidden md:flex flex-col border-r border-primary-100 py-2 px-2.5 transition-[width,padding] duration-200",
        "h-full overflow-y-auto",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* === عنوان Navigation + زر القائمة === */}
      <div className={cn("flex items-center mb-8 px-2", isCollapsed ? "justify-center" : "justify-between")}>
        {!isCollapsed && (
          <Text size={"sm"} font={"medium"} color={"primary-950"}>
            Navigation
          </Text>
        )}
        <Button size={"icon-sm"} variant={"ghost"} onClick={() => setIsCollapsed(!isCollapsed)}>
          <Menu className="w-5 h-5 text-primary" />
        </Button>
      </div>

      {/* === زر New Email === */}
      <Button
        size={"lg"}
        className={cn(
          "overflow-hidden bg-secondary-400 text-primary transition-colors hover:bg-secondary-600 mb-4",
          isCollapsed ? "mx-auto h-12 w-12 p-0" : "px-4"
        )}
      >
        <PencilLine className={cn("w-6 h-6 text-black", !isCollapsed && "mr-2")} />
        {!isCollapsed && (
          <Text className="text-black" font={"bold"}>
            New Email
          </Text>
        )}
      </Button>

      {/* === روابط التنقل === */}
      <nav className="space-y-1 flex-1 mt-4 relative">
        {isMailPage ? (
          <>
            {/* === روابط الإيميل (State-based) === */}
            {mailNavItems.map((item) => {
              // هل المجلد ده هو النشط؟
              const isActive = activeFolder === item.folder && pathname.startsWith("/mailbox/inbox");
              return (
                <button
                  key={item.name}
                  onClick={() => handleMailNavClick(item.folder)}
                  title={isCollapsed ? item.name : ""}
                  className={cn(
                    "flex items-center rounded-sm transition-colors duration-200 group mx-auto relative w-full",
                    isCollapsed ? "justify-center w-10 h-10" : "justify-between px-3 py-2",
                    isActive ? "text-primary" : "text-primary-600 hover:bg-primary-100 hover:text-primary"
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
                      className={cn(
                        "w-5 h-5 min-w-5 transition-colors",
                        isActive ? "text-primary" : "text-primary-600 group-hover:text-primary-600"
                      )}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    {!isCollapsed && (
                      <Text as={"span"} font={isActive ? "medium" : "default"} color={isActive ? "primary-950" : "primary-600"}>
                        {item.name}
                      </Text>
                    )}
                  </div>

                  {!isCollapsed && (
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform",
                        isActive ? "translate-x-1 text-primary" : "text-primary-600"
                      )}
                    />
                  )}
                </button>
              );
            })}

            {/* === الخط الفاصل === */}
            {!isCollapsed && (
              <div className="mt-2 border-t border-primary-100 mx-2" />
            )}

            {/* === روابط الأمان === */}
            {securityNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={isCollapsed ? item.name : ""}
                  className={cn(
                    "flex items-center rounded-sm transition-colors duration-200 group mx-auto relative",
                    isCollapsed ? "justify-center w-10 h-10" : "justify-between px-3 py-2",
                    isActive ? "text-primary" : "text-primary-600 hover:bg-primary-100 hover:text-primary"
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
                      className={cn(
                        "w-5 h-5 min-w-5 transition-colors",
                        isActive ? "text-primary" : "text-primary-600 group-hover:text-primary-600"
                      )}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    {!isCollapsed && (
                      <Text as={"span"} font={isActive ? "medium" : "default"} color={isActive ? "primary-950" : "primary-600"}>
                        {item.name}
                      </Text>
                    )}
                  </div>

                  {!isCollapsed && (
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform",
                        isActive ? "translate-x-1 text-primary" : "text-primary-600"
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </>
        ) : (
          // === روابط الصفحات الرئيسية (حقيقية) ===
          mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : ""}
                className={cn(
                  "flex items-center rounded-sm transition-colors duration-200 group mx-auto relative",
                  isCollapsed ? "justify-center w-10 h-10" : "justify-between px-3 py-2",
                  isActive ? "text-primary" : "text-primary-600 hover:bg-primary-100 hover:text-primary"
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
                    className={cn(
                      "w-5 h-5 min-w-5 transition-colors",
                      isActive ? "text-primary" : "text-primary-600 group-hover:text-primary-600"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {!isCollapsed && (
                    <Text as={"span"} font={isActive ? "medium" : "default"} color={isActive ? "primary-950" : "primary-600"}>
                      {item.name}
                    </Text>
                  )}
                </div>

                {!isCollapsed && (
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isActive ? "translate-x-1 text-primary" : "text-primary-600"
                    )}
                  />
                )}
              </Link>
            );
          })
        )}
      </nav>

      <div className="mt-4"><ThemeToggler isCollapsed={isCollapsed} /></div>

      <Text font={"medium"} color={"muted"} size={"sm"} className="mt-2 px-2 pt-4 text-left">
        {!isCollapsed ? "Version 1.0.1" : "V 1.0.1"}
      </Text>
    </aside>
  );
};