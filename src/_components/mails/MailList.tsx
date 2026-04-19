// ===== قائمة الإيميلات (Mail List) =====
// الكومبوننت ده بيعرض كل صفوف الإيميلات مع بعض
// وبيدعم السحب والإفلات (Drag and Drop) لإعادة الترتيب
//
// 🏠 تشبيه بـ HTML:
// تخيل إنك عندك <table> أو <ul> فيها عناصر
// كل عنصر هو <li> واحد (MailRow)
// وبتقدر تسحب أي <li> وتحطه في مكان تاني
"use client";

import React, { useState, useCallback } from "react";
import { useMailStore } from "@/stores/useMailStore";
import { MailRow } from "./MailRow";
import { Inbox } from "lucide-react";

export const MailList = () => {
  // === جلب البيانات من المتجر ===
  const getPagedEmails = useMailStore((s) => s.getPagedEmails);
  const reorderEmails = useMailStore((s) => s.reorderEmails);
  const activeFolder = useMailStore((s) => s.activeFolder);

  const emails = getPagedEmails();

  // ===== حالة السحب والإفلات =====
  // dragIndex = رقم الصف اللي بنسحبه
  // هو مؤقت - بيختفي لما تسيب الماوس
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // === لما تبدأ تسحب صف ===
  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  // === لما تعدي فوق صف تاني أثناء السحب ===
  const handleDragOver = useCallback(
    (overIndex: number) => {
      if (dragIndex === null || dragIndex === overIndex) return;
      reorderEmails(dragIndex, overIndex);
      setDragIndex(overIndex);
    },
    [dragIndex, reorderEmails]
  );

  // === لما تسيب (تفلت) الماوس ===
  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
  }, []);

  // === لو مفيش إيميلات === 
  // بنعرض رسالة فاضية - زي صفحة 404 بس أحلى
  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-primary-400">
        <Inbox className="w-16 h-16 mb-4 text-primary-300" />
        <p className="text-lg font-medium">No emails found</p>
        <p className="text-sm mt-1">
          {activeFolder === "trash"
            ? "Your trash is empty"
            : activeFolder === "starred"
              ? "No starred emails yet"
              : "No emails in this folder"}
        </p>
      </div>
    );
  }

  return (
    // === الحاوية الرئيسية للقائمة ===
    <div className="flex-1 overflow-y-auto">
      {emails.map((email, index) => (
        <MailRow
          key={email.id}
          email={email}
          index={index}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
};
