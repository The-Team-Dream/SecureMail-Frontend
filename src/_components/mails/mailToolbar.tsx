// ===== شريط الأدوات (Mail Toolbar) =====
// الشريط اللي فوق تابات التصنيف - فيه:
// 1. Checkbox لتحديد كل الإيميلات
// 2. زر تحديث (Refresh)
// 3. معلومات الصفحة (مثل "1-18 of 50")
// 4. أزرار التنقل بين الصفحات (< و >)
"use client";

import React from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useMailStore } from "@/stores/useMailStore";
import { cn } from "@/lib/utils";
import { Text } from "../shared/Text";

export const MailToolbar = () => {
  // ──────── الحل الصحيح: استخدام الـ store مباشرة بدون selectors مكسورة ────────
  // 🔧 المشكلة كانت: Zustand مبيعملش re-render لما نجيب getter function
  // لأن reference الدالة ثابت ومبيتغيرش
  // الحل: نستخدم useMailStore.getState() جوه الـ render مع الاشتراك في القيم الأساسية

  // === الاشتراك في كل القيم اللي بنعتمد عليها ===
  // لما أي قيمة من دول تتغير، React هيعمل re-render للكومبوننت
  const currentPage = useMailStore((s) => s.currentPage);
  const selectedIds = useMailStore((s) => s.selectedIds);

  // === الاشتراك في القيم اللي الـ filtering بيعتمد عليها ===
  // من غير الاشتراك ده، تغيير التاب أو المجلد مش هيحدّث العداد
  const storeEmails = useMailStore((s) => s.emails);
  const storeFolder = useMailStore((s) => s.activeFolder);
  const storeClassification = useMailStore((s) => s.activeClassification);
  const storeSearch = useMailStore((s) => s.searchQuery);

  // === جلب الأفعال (Actions) - دي ثابتة ومش محتاجة re-render ===
  const setCurrentPage = useMailStore((s) => s.setCurrentPage);
  const selectAllOnPage = useMailStore((s) => s.selectAllOnPage);
  const deselectAll = useMailStore((s) => s.deselectAll);

  // ──────── حساب القيم المشتقة مباشرة (Inline Computed) ────────
  // بدل ما نستخدم الـ getters من المتجر (اللي مش reactive)
  // بنحسب القيم هنا مباشرة من البيانات اللي اشتركنا فيها

  // === فلترة الإيميلات (نفس لوجيك getFilteredEmails) ===
  const ITEMS_PER_PAGE = 18;

  let filtered = storeEmails;

  // --- فلترة حسب المجلد ---
  if (storeFolder === "starred") {
    filtered = filtered.filter((e) => e.isStarred && e.folder !== "trash");
  } else {
    filtered = filtered.filter((e) => e.folder === storeFolder);
  }

  // --- فلترة حسب التصنيف (التاب) - في صندوق الوارد فقط ---
  if (storeFolder === "inbox") {
    filtered = filtered.filter((e) => e.classification === storeClassification);
  }

  // --- فلترة حسب البحث ---
  if (storeSearch.trim()) {
    const q = storeSearch.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.subject.toLowerCase().includes(q) ||
        e.sender.toLowerCase().includes(q),
    );
  }

  // === حساب الصفحات ===
  const total = filtered.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pagedEmails = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const pagedIds = pagedEmails.map((e) => e.id);

  // === معلومات الـ Pagination ===
  const start = total === 0 ? 0 : startIdx + 1;
  const end = total === 0 ? 0 : Math.min(currentPage * ITEMS_PER_PAGE, total);

  // === حالة الـ Checkbox ===
  const isAllSelected =
    pagedIds.length > 0 && pagedIds.every((id) => selectedIds.includes(id));
  const isSomeSelected =
    pagedIds.some((id) => selectedIds.includes(id)) && !isAllSelected;

  // ──────── أزرار الصفحات ────────
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRefresh = () => {
    deselectAll();
  };

  return (
    <div className="flex items-center justify-between px-2 sm:px-4 py-2">
      {/* ══════  Checkbox + Refresh ══════ */}
      <div className="flex items-center gap-1">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isAllSelected}
            ref={(el) => {
              if (el) {
                el.indeterminate = isSomeSelected;
              }
            }}
            onChange={selectAllOnPage}
            className="w-4 h-4 rounded border-primary-900 text-secondary-500 focus:ring-secondary-500 cursor-pointer accent-secondary-500"
            aria-label="Select all emails on this page"
          />

          <button
            onClick={selectAllOnPage}
            className="p-0.5 hover:bg-primary-100 rounded transition-colors cursor-pointer"
            aria-label="Toggle select all"
          >
            <ChevronDown className="w-4 h-4 text-primary-900" />
          </button>
        </div>

        <button
          onClick={handleRefresh}
          className="p-1.5 text-primary-900 hover:bg-primary-100 rounded-full transition-colors cursor-pointer ml-1"
          aria-label="Refresh emails"
        >
          <RefreshCw className="w-4 h-4 text-primary-900" />
        </button>
      </div>

      {/* ══════ Pagination ══════ */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Text className=" text-primary select-none">
          {total === 0 ? "0" : `${start}-${end}`} of {total}
        </Text>

        {/* === زر الصفحة السابقة < === */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className={cn(
            "p-1 rounded-full transition-colors cursor-pointer",
            currentPage <= 1
              ? "text-primary-300 cursor-not-allowed"
              : "text-primary hover:bg-primary-100",
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className={cn(
            "p-1 rounded-full transition-colors cursor-pointer",
            currentPage >= totalPages
              ? "text-primary-300 cursor-not-allowed"
              : "text-primary hover:bg-primary-100",
          )}
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
