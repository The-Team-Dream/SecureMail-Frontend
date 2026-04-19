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
import { MailToolbar } from "./mailToolbar";
import { MailTabs } from "./mailTabs";
import { MailList } from "./mailList";
import { useMailStore } from "@/stores/useMailStore";
import Container from "../shared/Container";
import { Input } from "../shared/Input";
import { Mail } from "lucide-react";

export const MailInbox = () => {
  const activeFolder = useMailStore((s) => s.activeFolder);

  // === عنوان المجلد الحالي ===
  // بنحوله لحرف كبير في الأول (مثل "inbox" → "Inbox")

  return (
    <Container>
      <div className="flex flex-col h-full bg-background">
        <div className="block md:hidden mb-4">
          <Input
            className="bg-primary-100/20 w-full"
            type="search"
            leftIcon={<Mail className="w-5 h-5 text-primary-500" />}
            placeholder="Search Email..."
          />
        </div>
        <MailToolbar />
        <MailTabs />
        <MailList />
      </div>
    </Container>
  );
};
