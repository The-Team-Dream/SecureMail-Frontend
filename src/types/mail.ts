// ===== أنواع البيانات الخاصة بالإيميلات =====
// دي زي ما تعمل "قالب" أو "نموذج" بيقول الإيميل شكله إيه
// فكر فيها كأنك بتصمم <form> في HTML وبتحدد كل الحقول اللي المستخدم لازم يملاها

/**
 * المجلدات اللي ممكن الإيميل يكون فيها
 * زي فولدرات الملفات على الكمبيوتر - كل إيميل لازم يكون في فولدر واحد
 * 🚨 ملحوظة: بنستخدم "mailbox" مش "mails" عشان يتوافق مع الـ API
 */
export type Folder = "inbox" | "sent" | "starred" | "trash" | "spam" | "phishing" | "malware";

/**
 * تصنيف الإيميل - هل هو أساسي؟ ترويجي؟ اجتماعي؟ تحديثات؟
 * زي ما Gmail بيفرز الإيميلات في تابات
 */
export type Classification = "primary" | "promotions" | "social" | "updates";

/**
 * شكل بيانات الإيميل الواحد
 * كل إيميل بيحتوي على كل المعلومات دي
 * الأسماء مطابقة لـ api_structure.json تماماً
 */
export interface Email {
  id: string;                    // رقم فريد - زي رقم الهوية لكل إيميل
  subject: string;               // عنوان الإيميل
  bodyText: string;              // محتوى/نص الإيميل
  sender: string;                // اسم المرسل
  senderEmail: string;           // إيميل المرسل
  isRead: boolean;               // هل الإيميل مقروء؟ true = مقروء، false = جديد
  isStarred: boolean;            // هل عليه نجمة؟ true = مميز
  folder: Folder;                // في أنهي مجلد (صندوق الوارد، المرسلة، إلخ)
  classification: Classification; // تصنيفه (أساسي، ترويجي، إلخ)
  date: string;                  // تاريخ الإيميل
  hasAttachment: boolean;        // هل فيه ملف مرفق؟
  attachmentName?: string;       // اسم الملف المرفق (اختياري)
}
