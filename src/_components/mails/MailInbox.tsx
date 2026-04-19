// ===== الصفحة الرئيسية للإيميلات (Mail Inbox) =====
// الكومبوننت ده بيجمع كل الأجزاء مع بعض:
// MailToolbar + MailTabs + MailList
//
// 🏠 تشبيه بـ HTML:
// تخيل إنك عندك <div class="inbox-container"> 
// وجواه 3 أقسام:
//   <div class="toolbar">...</div>    ← شريط الأدوات
//   <div class="tabs">...</div>       ← تابات التصنيف
//   <div class="email-list">...</div> ← قائمة الإيميلات
// الكومبوننت ده هو الـ container اللي بيلم كل حاجة
"use client";

import React from "react";
import { MailToolbar } from "./MailToolbar";
import { MailTabs } from "./MailTabs";
import { MailList } from "./MailList";
import { useMailStore } from "@/stores/useMailStore";

export const MailInbox = () => {
  const activeFolder = useMailStore((s) => s.activeFolder);

  // === عنوان المجلد الحالي ===
  // بنحوله لحرف كبير في الأول (مثل "inbox" → "Inbox")
  const folderTitle =
    activeFolder.charAt(0).toUpperCase() + activeFolder.slice(1);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* === عنوان المجلد (لو مش inbox) === */}
      {activeFolder !== "inbox" && (
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-lg font-semibold text-primary">{folderTitle}</h1>
        </div>
      )}

      {/* === شريط الأدوات === */}
      <MailToolbar />

      {/* === تابات التصنيف (بتظهر بس في inbox) === */}
      <MailTabs />

      {/* === قائمة الإيميلات === */}
      <MailList />
    </div>
  );
};
