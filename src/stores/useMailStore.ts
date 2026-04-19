// ===== متجر إدارة الإيميلات (Email Store) =====
// المتجر ده هو "المخ" بتاع التطبيق - بيخزن كل البيانات ويتحكم فيها
//
// 🏠 تشبيه بـ HTML/CSS/JavaScript:
// تخيل إن عندك ملف JavaScript فيه متغيرات عامة (global variables):
//   let emails = [...];           ← البيانات
//   let currentPage = 1;          ← الصفحة الحالية
//   let activeFolder = "inbox";   ← المجلد النشط
// والمتجر ده بيعمل نفس الشيء بس بطريقة منظمة
// كل ما تتغير قيمة، الصفحة بتتحدث تلقائي (زي ما تعمل DOM manipulation)
//
// 🚨 ملحوظة: بنستخدم "mailbox"/"emails" مش "mails" عشان يتوافق مع الـ API

import { create } from "zustand";
import type { Email, Folder, Classification } from "@/types/mail";
import { mockEmails } from "@/app/mails/[folder]/MOCKDATA";

// === ثابت: عدد الإيميلات في كل صفحة ===
// زي ما تقول: أنا عايز أعرض 18 صف بس في كل صفحة من الجدول
const ITEMS_PER_PAGE = 18;

// ===== تعريف شكل المتجر (Store Interface) =====
// ده زي "الخريطة" اللي بتقول فيها كل حاجة المتجر بيخزنها وبيعملها
// فكر فيه كأنك بتصمم <form> وبتحدد كل الحقول والأزرار
interface MailState {
  // ──────── الحالات (State) ────────
  // دول "المتغيرات" اللي بتتخزن - زي let في JavaScript

  emails: Email[];                    // كل الإيميلات - زي مصفوفة (array) عادية
  activeFolder: Folder;               // المجلد الحالي (inbox, sent, starred, إلخ)
  activeClassification: Classification; // التاب الحالي (primary, promotions, إلخ)
  currentPage: number;                // رقم الصفحة الحالية
  selectedIds: string[];              // الإيميلات المحددة (selected) - مصفوفة أرقام
  searchQuery: string;                // نص البحث

  // ──────── الأفعال (Actions) ────────
  // دول "الدوال" (functions) اللي بتغير المتغيرات
  // زي ما يكون عندك onclick="changeFolder('sent')" في HTML

  setActiveFolder: (folder: Folder) => void;
  setActiveClassification: (classification: Classification) => void;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;

  toggleSelectEmail: (id: string) => void;   // تحديد/إلغاء تحديد إيميل واحد
  selectAllOnPage: () => void;               // تحديد كل الإيميلات في الصفحة الحالية
  deselectAll: () => void;                   // إلغاء تحديد الكل

  toggleStarEmail: (id: string) => void;     // إضافة/إزالة نجمة
  toggleReadEmail: (id: string) => void;     // تبديل حالة القراءة (مقروء/غير مقروء)
  deleteEmail: (id: string) => void;         // حذف إيميل (نقله للمهملات)
  reorderEmails: (fromIndex: number, toIndex: number) => void; // إعادة ترتيب بالسحب

  // ──────── الحسابات (Computed Getters) ────────
  // دول "حسابات" بتحسب قيم من البيانات الموجودة
  // زي ما يكون عندك function بترجع نتيجة بناءً على المتغيرات

  getFilteredEmails: () => Email[];          // الإيميلات بعد الفلترة
  getPagedEmails: () => Email[];             // الإيميلات في الصفحة الحالية فقط (18 كحد أقصى)
  getTotalPages: () => number;               // عدد الصفحات الكلي
  getUnreadCount: (classification: Classification) => number; // عدد الغير مقروءة لكل تاب
  getPaginationInfo: () => { start: number; end: number; total: number }; // معلومات الصفحة
}

// ===== إنشاء المتجر (Create Store) =====
// create() هي الدالة اللي بتبني المتجر
// (set, get) دول أدوات من Zustand:
//   set = لتغيير القيم (زي element.innerHTML = "...")
//   get = لقراءة القيم الحالية (زي element.innerHTML)
export const useMailStore = create<MailState>((set, get) => ({
  // ──────────────────────────────────────────────
  // 1️⃣  القيم الابتدائية (Initial State)
  // ──────────────────────────────────────────────
  // زي ما تكتب let x = "قيمة ابتدائية" في JavaScript

  emails: mockEmails,              // بنبدأ بالبيانات الوهمية من ملف MOCKDATA
  activeFolder: "inbox",           // المجلد الافتراضي = صندوق الوارد
  activeClassification: "primary", // التاب الافتراضي = الأساسي
  currentPage: 1,                  // بنبدأ من الصفحة الأولى
  selectedIds: [],                 // مفيش إيميلات محددة في البداية
  searchQuery: "",                 // مفيش بحث في البداية

  // ──────────────────────────────────────────────
  // 2️⃣  أفعال التنقل (Navigation Actions)
  // ──────────────────────────────────────────────

  // === تغيير المجلد (Inbox → Sent → Starred → إلخ) ===
  // لما تضغط على "Sent" في الـ Sidebar مثلاً
  // بنغير المجلد + بنرجع للصفحة 1 + بنشيل أي تحديد
  // 🏠 تشبيه: زي ما تضغط على رابط <a href="sent.html">
  //    بس بدل ما يروح لصفحة جديدة، بيغير المحتوى في نفس الصفحة
  setActiveFolder: (folder: Folder) => {
    set({
      activeFolder: folder,
      currentPage: 1,
      selectedIds: [],
      activeClassification: "primary",
    });
  },

  // === تغيير التاب (Primary → Promotions → Social → Updates) ===
  // لما تضغط على "Promotions" في التابات فوق القائمة
  // 🏠 تشبيه: زي ما يكون عندك 4 أزرار <button>
  //    كل واحد بيغير class="active" ويعرض محتوى مختلف
  setActiveClassification: (classification: Classification) => {
    set({
      activeClassification: classification,
      currentPage: 1,
      selectedIds: [],
    });
  },

  // === تغيير رقم الصفحة ===
  // لما تضغط على زر < أو > في شريط الأدوات
  setCurrentPage: (page: number) => {
    set({
      currentPage: page,
      selectedIds: [],
    });
  },

  // === تغيير نص البحث ===
  // لما تكتب في خانة البحث في الـ Navbar
  setSearchQuery: (query: string) => {
    set({
      searchQuery: query,
      currentPage: 1,
    });
  },

  // ──────────────────────────────────────────────
  // 3️⃣  أفعال التحديد (Selection Actions)
  // ──────────────────────────────────────────────

  // === تحديد/إلغاء تحديد إيميل واحد ===
  // لما تضغط على الـ checkbox جنب إيميل معين
  // 🏠 تشبيه: زي <input type="checkbox"> في HTML
  //    لما تضغط عليه بيتحول من checked لـ unchecked والعكس
  toggleSelectEmail: (id: string) => {
    const { selectedIds } = get();
    // لو الإيميل موجود في القائمة المحددة → شيله
    // لو مش موجود → أضيفه
    if (selectedIds.includes(id)) {
      set({ selectedIds: selectedIds.filter((sid) => sid !== id) });
    } else {
      set({ selectedIds: [...selectedIds, id] });
    }
  },

  // === تحديد كل الإيميلات في الصفحة الحالية ===
  // لما تضغط على checkbox "Select All" في شريط الأدوات
  // لو كلهم محددين بالفعل → ألغي التحديد
  // لو مش كلهم → حدد الكل
  // 🏠 تشبيه: زي ما يكون عندك زر JavaScript
  //    document.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = true)
  selectAllOnPage: () => {
    const pagedEmails = get().getPagedEmails();
    const pagedIds = pagedEmails.map((e) => e.id);
    const { selectedIds } = get();

    // هل كل الإيميلات في الصفحة محددة؟
    const allSelected =
      pagedIds.length > 0 && pagedIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      // ألغي تحديد إيميلات الصفحة الحالية بس (مش كل المحدد)
      set({ selectedIds: selectedIds.filter((id) => !pagedIds.includes(id)) });
    } else {
      // أضيف كل إيميلات الصفحة للقائمة المحددة
      const newSelectedIds = [...new Set([...selectedIds, ...pagedIds])];
      set({ selectedIds: newSelectedIds });
    }
  },

  // === إلغاء تحديد كل الإيميلات ===
  deselectAll: () => {
    set({ selectedIds: [] });
  },

  // ──────────────────────────────────────────────
  // 4️⃣  أفعال الإيميل (Email Actions)
  // ──────────────────────────────────────────────

  // === تبديل النجمة (Star/Unstar) ===
  // لما تضغط على أيقونة النجمة ⭐ جنب الإيميل
  // لو عليه نجمة → شيلها، لو مفيش → حطها
  // الإيميلات اللي عليها نجمة بتظهر في قسم "Starred"
  // 🏠 تشبيه: زي ما تضغط على زر فبيغير class من "star-empty" لـ "star-filled"
  toggleStarEmail: (id: string) => {
    set({
      emails: get().emails.map((email) =>
        email.id === id ? { ...email, isStarred: !email.isStarred } : email
      ),
    });
  },

  // === تبديل حالة القراءة (Read/Unread) ===
  // لما تضغط على الإيميل أو على زر "Mark as read/unread"
  // الإيميلات الغير مقروءة بتكون بخط عريض (Bold)
  // 🏠 تشبيه: زي ما تغير class من "font-bold" لـ "font-normal"
  //    element.classList.toggle("font-bold")
  toggleReadEmail: (id: string) => {
    set({
      emails: get().emails.map((email) =>
        email.id === id ? { ...email, isRead: !email.isRead } : email
      ),
    });
  },

  // === حذف إيميل (نقله للمهملات) ===
  // مش بنحذف الإيميل فعلاً - بس بنغير المجلد بتاعه لـ "trash"
  // 🏠 تشبيه: زي ما تنقل ملف من فولدر "Inbox" لفولدر "Trash"
  //    مش بتمسحه من الهارد - بس بتغير مكانه
  deleteEmail: (id: string) => {
    set({
      emails: get().emails.map((email) =>
        email.id === id
          ? { ...email, folder: "trash" as Folder, isStarred: false }
          : email
      ),
      // شيل الإيميل المحذوف من القائمة المحددة
      selectedIds: get().selectedIds.filter((sid) => sid !== id),
    });
  },

  // === إعادة ترتيب الإيميلات (Drag and Drop) ===
  // لما تسحب إيميل وتحطه في مكان تاني
  // بنبدل مكان الإيميلين في المصفوفة الرئيسية
  //
  // 🏠 تشبيه: تخيل عندك <ul> فيها <li> عناصر
  //    لما تسحب <li> رقم 3 وتحطه مكان رقم 5
  //    بتستخدم insertBefore() في JavaScript عشان تغير ترتيبهم
  //
  // fromIndex: مكان الإيميل اللي بنسحبه (في الصفحة الحالية)
  // toIndex: المكان اللي عايزين نحطه فيه
  reorderEmails: (fromIndex: number, toIndex: number) => {
    // 1. نجيب الإيميلات المفلترة والصفحة الحالية
    const filtered = get().getFilteredEmails();
    const page = get().currentPage;
    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    const pagedEmails = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    // 2. نجيب الإيميل اللي بنسحبه والمكان الجديد
    const fromEmail = pagedEmails[fromIndex];
    const toEmail = pagedEmails[toIndex];

    // لو أي واحد فيهم مش موجود → ما تعملش حاجة
    if (!fromEmail || !toEmail) return;

    // 3. ندور عليهم في المصفوفة الرئيسية
    const emails = [...get().emails];
    const mainFromIdx = emails.findIndex((e) => e.id === fromEmail.id);
    const mainToIdx = emails.findIndex((e) => e.id === toEmail.id);

    if (mainFromIdx === -1 || mainToIdx === -1) return;

    // 4. نبدل مكانهم (Swap)
    [emails[mainFromIdx], emails[mainToIdx]] = [
      emails[mainToIdx],
      emails[mainFromIdx],
    ];

    set({ emails });
  },

  // ──────────────────────────────────────────────
  // 5️⃣  الحسابات (Computed Getters)
  // ──────────────────────────────────────────────
  // دول مش بيغيروا حاجة - بس بيحسبوا قيم من البيانات الموجودة
  // زي ما يكون عندك function بترجع نتيجة بناءً على المتغيرات

  // === جلب الإيميلات بعد الفلترة ===
  // بتفلتر حسب: المجلد + التاب + البحث
  // 🏠 تشبيه: زي ما تكتب CSS selector بيعرض عناصر معينة ويخفي الباقي
  //    .inbox { display: block } .sent { display: none }
  getFilteredEmails: () => {
    const { emails, activeFolder, activeClassification, searchQuery } = get();

    let filtered = emails;

    // --- فلترة حسب المجلد ---
    if (activeFolder === "starred") {
      // في قسم "Starred" بنعرض كل الإيميلات اللي عليها نجمة
      // بغض النظر عن المجلد الأصلي (inbox, sent, إلخ)
      // بس مش اللي في المهملات
      filtered = filtered.filter((e) => e.isStarred && e.folder !== "trash");
    } else {
      // في باقي المجلدات بنفلتر بالمجلد مباشرة
      filtered = filtered.filter((e) => e.folder === activeFolder);
    }

    // --- فلترة حسب التصنيف (التاب) - في صندوق الوارد فقط ---
    // التابات (Primary, Promotions, إلخ) بتظهر بس في inbox
    if (activeFolder === "inbox") {
      filtered = filtered.filter(
        (e) => e.classification === activeClassification
      );
    }

    // --- فلترة حسب البحث ---
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.sender.toLowerCase().includes(q)
      );
    }

    return filtered;
  },

  // === جلب إيميلات الصفحة الحالية فقط (18 كحد أقصى) ===
  // بتاخد الإيميلات المفلترة وتقطع منها 18 بس
  // 🏠 تشبيه: لو عندك جدول HTML فيه 50 صف
  //    بتعرض 18 صف بس وتخفي الباقي بـ display: none
  getPagedEmails: () => {
    const filtered = get().getFilteredEmails();
    const page = get().currentPage;
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  },

  // === حساب عدد الصفحات ===
  // لو عندك 50 إيميل و 18 في الصفحة = 3 صفحات (50/18 = 2.77 → 3)
  getTotalPages: () => {
    const filtered = get().getFilteredEmails();
    return Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  },

  // === حساب عدد الإيميلات الغير مقروءة لكل تاب ===
  // الرقم اللي بيظهر جنب اسم التاب مثل "7 New"
  // بندور في كل الإيميلات اللي في inbox + التصنيف المطلوب + مش مقروءة
  getUnreadCount: (classification: Classification) => {
    const { emails } = get();
    return emails.filter(
      (e) =>
        e.folder === "inbox" &&
        e.classification === classification &&
        !e.isRead
    ).length;
  },

  // === معلومات الـ Pagination (مثل "1-18 of 50") ===
  // بترجع: أول إيميل في الصفحة، آخر إيميل، والعدد الكلي
  getPaginationInfo: () => {
    const filtered = get().getFilteredEmails();
    const page = get().currentPage;
    const total = filtered.length;

    if (total === 0) {
      return { start: 0, end: 0, total: 0 };
    }

    const start = (page - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(page * ITEMS_PER_PAGE, total);

    return { start, end, total };
  },
}));
