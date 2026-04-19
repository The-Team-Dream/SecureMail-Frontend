// ===== صف الإيميل الواحد (Mail Row) =====
// الكومبوننت ده بيعرض صف واحد في قائمة الإيميلات
//
// 🏠 تشبيه بـ HTML:
// تخيل إنك عندك <tr> (صف) في <table>
// كل صف فيه: checkbox + نجمة + اسم المرسل + العنوان + التاريخ
// الكومبوننت ده هو الـ <tr> بتاعك بس بشكل أحلى
"use client";

import React from "react";
import { Star, FileText, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Email } from "@/types/mail";
import { useMailStore } from "@/stores/useMailStore";

// الـ Props دي زي الـ attributes بتاعة HTML tag
// يعني لما تكتب <img src="..." alt="..."> - الـ src و alt دول props
interface MailRowProps {
  email: Email;         // بيانات الإيميل
  index: number;        // رقم الصف (للسحب والإفلات)
  onDragStart: (index: number) => void;  // لما تبدأ تسحب
  onDragOver: (index: number) => void;   // لما تعدي فوق صف تاني
  onDragEnd: () => void;                 // لما تسيب
}

export const MailRow = ({
  email,
  index,
  onDragStart,
  onDragOver,
  onDragEnd,
}: MailRowProps) => {
  // === جلب الأفعال من المتجر ===
  // زي ما تجيب function من ملف JavaScript خارجي
  const toggleSelectEmail = useMailStore((s) => s.toggleSelectEmail);
  const toggleStarEmail = useMailStore((s) => s.toggleStarEmail);
  const selectedIds = useMailStore((s) => s.selectedIds);

  // هل الإيميل ده محدد (selected)؟
  const isSelected = selectedIds.includes(email.id);

  return (
    // === الصف الرئيسي ===
    // draggable="true" بيخلي الصف قابل للسحب - زي drag and drop في HTML5
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => {
        e.preventDefault(); // ضروري عشان الـ drop يشتغل
        onDragOver(index);
      }}
      onDragEnd={onDragEnd}
      className={cn(
        // الشكل الأساسي للصف
        "group flex items-center gap-1 sm:gap-3 px-2 sm:px-4 py-2.5 border-b border-primary-100",
        "cursor-pointer transition-colors duration-150",
        // لما تعدي بالماوس فوقه بيتغير لونه (hover effect)
        "hover:bg-primary-50",
        // لو محدد (selected) بيكون ليه لون مميز
        isSelected && "bg-secondary-50",
        // لو مش مقروء بيكون الخلفية أغمق شوية
        !email.isRead && "bg-white dark:bg-primary-50/50"
      )}
    >
      {/* === أيقونة السحب (Grip) === */}
      {/* بتظهر بس لما تعدي بالماوس فوق الصف */}
      <GripVertical className="w-4 h-4 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab shrink-0 hidden sm:block" />

      {/* === الـ Checkbox === */}
      {/* زي <input type="checkbox"> في HTML */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => toggleSelectEmail(email.id)}
        className="w-4 h-4 rounded border-primary-300 text-secondary-500 
                   focus:ring-secondary-500 cursor-pointer accent-secondary-500 shrink-0"
        onClick={(e) => e.stopPropagation()} // عشان الضغط على الـ checkbox ما يفتحش الإيميل
      />

      {/* === النجمة (Star) === */}
      {/* لما تضغط عليها بتتحول من فاضية لملونة والعكس */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleStarEmail(email.id);
        }}
        className="p-0.5 hover:bg-primary-100 rounded-full transition-colors shrink-0"
        aria-label={email.isStarred ? "Unstar email" : "Star email"}
      >
        <Star
          className={cn(
            "w-4 h-4 sm:w-5 sm:h-5 transition-colors",
            email.isStarred
              ? "fill-warning-400 text-warning-400" // نجمة ملونة (مميز)
              : "text-primary-400"                   // نجمة فاضية (مش مميز)
          )}
        />
      </button>

      {/* === محتوى الإيميل (الاسم + العنوان + التاريخ) === */}
      <div className="flex-1 flex items-center min-w-0 gap-2 sm:gap-4">
        {/* اسم المرسل */}
        <span
          className={cn(
            "w-20 sm:w-28 shrink-0 truncate text-xs sm:text-sm",
            // لو الإيميل مش مقروء → النص بيكون Bold (عريض)
            // زي ما تحط class="font-bold" في CSS
            !email.isRead ? "font-bold text-primary" : "font-normal text-primary-700"
          )}
        >
          {email.sender}
        </span>

        {/* العنوان + المرفقات */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span
            className={cn(
              "truncate text-xs sm:text-sm",
              !email.isRead ? "font-bold text-primary" : "font-normal text-primary-600"
            )}
          >
            {email.subject}
          </span>

          {/* === المرفق (Attachment) === */}
          {/* لو الإيميل فيه ملف مرفق بيظهر زر صغير بأيقونة PDF */}
          {email.hasAttachment && email.attachmentName && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 
                           border border-primary-200 rounded text-xs text-primary-600 shrink-0">
              <FileText className="w-3 h-3 text-error-500" />
              {email.attachmentName}
            </span>
          )}
        </div>

        {/* التاريخ */}
        <span
          className={cn(
            "text-xs shrink-0 ml-auto pl-2",
            !email.isRead ? "font-bold text-primary" : "font-normal text-primary-500"
          )}
        >
          {email.date}
        </span>
      </div>
    </div>
  );
};
