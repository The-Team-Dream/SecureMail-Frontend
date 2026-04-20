// ===== أنواع البيانات الخاصة بالإيميلات =====
// دي زي ما تعمل "قالب" أو "نموذج" بيقول الإيميل شكله إيه
// فكر فيها كأنك بتصمم <form> في HTML وبتحدد كل الحقول اللي المستخدم لازم يملاها

/**
 * المجلدات اللي ممكن الإيميل يكون فيها
 * زي فولدرات الملفات على الكمبيوتر - كل إيميل لازم يكون في فولدر واحد
 * 🚨 ملحوظة: بنستخدم "mailbox" مش "mails" عشان يتوافق مع الـ API
 */
export type Folder =
  | "inbox"
  | "sent"
  | "starred"
  | "trash"
  | "spam"
  | "phishing"
  | "malware"
  | "archive";

/**
 * تصنيف الإيميل - هل هو أساسي؟ ترويجي؟ اجتماعي؟ تحديثات؟
 * زي ما Gmail بيفرز الإيميلات في تابات
 */
export type Classification = "primary" | "promotions" | "social" | "updates";

export interface Email {
  id: string;
  subject: string;
  bodyText: string;
  sender: string;
  senderEmail: string;
  isRead: boolean;
  isStarred: boolean;
  folder: Folder;
  classification: Classification;
  date: string;
  hasAttachment: boolean;
  attachmentName?: string;
}
