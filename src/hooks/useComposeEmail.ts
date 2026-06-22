"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { baseURL } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMailStore } from "@/stores/useMailStore";
import { useParams, useRouter } from "next/navigation";
import {
  useSendEmail,
  useReplyEmail,
  useForwardEmail,
} from "@/APIs/hooks/emails";
import { toast } from "sonner";
import { emailSchema, type EmailFormValues } from "@/schemas/SendEmail";
import { type EmojiClickData } from "emoji-picker-react";
import { formatForwardEmail, formatReplyEmail } from "@/utils/emailFormatter";
import { useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "@/APIs/features/emails";
import { useMailboxes } from "@/APIs/hooks/mailboxes";
import { useServerErrors } from "@/utils/form-utils";
const fetchAttachmentAsFile = async (
  mailboxId: string,
  emailId: string,
  attachmentId: string,
  filename: string,
  attachmentUrl?: string,
): Promise<File> => {
  const token = Cookies.get("token");
  let url =
    attachmentUrl ||
    `${baseURL}/mailboxes/${mailboxId}/emails/${emailId}/attachments/${attachmentId}/download`;

  if (url && !url.startsWith("http")) {
    url = `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
  }

  const headers: HeadersInit = {};
  if (token && (!url.startsWith("http") || url.startsWith(baseURL) || url.includes("/mailboxes/"))) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch attachment: ${response.status} ${response.statusText}`);
  }

  const blob = await response.blob();
  return new File([blob], filename, {
    type: blob.type || "application/octet-stream",
  });
};

export const useComposeEmail = () => {
  const {
    isComposeOpen: isOpen,
    setComposeOpen: setOpen,
    composeMode,
    composeData,
  } = useMailStore();
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const { data: mailboxes = [] } = useMailboxes();

  // Determine the current mailbox ID from params or fallback to first mailbox
  const mailboxIdToUse =
    (params?.mailboxId as string) || mailboxes[0]?.id?.toString() || "";

  // ── Form ──────────────────────────────────────────────────────────────
  const form = useForm<EmailFormValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(emailSchema),
    defaultValues: {
      mode: composeMode,
      from: mailboxIdToUse,
      to: "",
      subject: "",
      cc: "",
      bcc: "",
      bodyText: "",
      bodyHtml: "",
    } as EmailFormValues,
  });

  const { handleServerErrors } = useServerErrors<EmailFormValues>(
    form.setError,
  );

  const sendMutation = useSendEmail(mailboxIdToUse ?? "");
  const replyMutation = useReplyEmail(mailboxIdToUse ?? "");
  const forwardMutation = useForwardEmail(mailboxIdToUse ?? "");

  // ── Attachments state ──────────────────────────────────────────────────
  const [attachments, setAttachments] = useState<File[]>([]);
  const [forwardedAttachments, setForwardedAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Rich-text body editor ref (contentEditable div)
  const bodyEditorRef = useRef<HTMLDivElement>(null);

  // ── Emoji picker ──────────────────────────────────────────────────────
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  // ── CC / BCC visibility ───────────────────────────────────────────────
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  // ── Attachments state ──────────────────────────────────────────────────

  // Reset form when opened / mode changes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        mode: composeMode,
        from: mailboxIdToUse,
        to: composeData?.to ?? "",
        subject: composeMode === "forward" ? (composeData?.subject ?? "") : "",
        cc: "",
        bcc: "",
        bodyText: composeMode === "reply" ? (composeData?.body ?? "") : "",
        bodyHtml: "",
      } as EmailFormValues);
      setAttachments([]);
      setForwardedAttachments([]);
      setShowEmoji(false);
      setShowCc(false);
      setShowBcc(false);
      // Reset the contentEditable body editor
      if (bodyEditorRef.current) {
        bodyEditorRef.current.innerHTML =
          composeMode === "reply" ? (composeData?.body ?? "") : "";
      }
    }
  }, [isOpen, composeMode, composeData]);

  // Sync form's 'from' field with mailboxIdToUse if not set
  useEffect(() => {
    if (isOpen && mailboxIdToUse && !form.getValues("from")) {
      form.setValue("from", mailboxIdToUse);
    }
  }, [isOpen, mailboxIdToUse, form]);

  // If forwarding or replying to an email with attachments, download them so they are included
  useEffect(() => {
    const attachmentsToDownload = composeData?.attachments;
    if (
      isOpen &&
      (composeMode === "forward" || composeMode === "reply") &&
      mailboxIdToUse &&
      composeData?.emailId &&
      attachmentsToDownload?.length
    ) {
      const downloadForwardedAttachments = async () => {
        try {
          const files: File[] = [];
          for (const att of attachmentsToDownload) {
            const attAsCustom = att as any;
            const attId = String(
              att.id ??
                attAsCustom.attachmentId ??
                attAsCustom.attachment_id ??
                attAsCustom._id ??
                attAsCustom.fileId ??
                "",
            );
            const attUrl = att.url || attAsCustom.path;

            const file = await fetchAttachmentAsFile(
              mailboxIdToUse,
              composeData.emailId!,
              attId,
              att.filename,
              attUrl,
            );
            files.push(file);
          }
          setForwardedAttachments(files);
        } catch (error) {
          console.error("Failed to load forwarded attachments:", error);
        }
      };
      downloadForwardedAttachments();
    }
  }, [isOpen, composeMode, composeData, mailboxIdToUse]);

  // Close emoji picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────
  const addFiles = (files: File[]) => {
    setAttachments((prev) => {
      const uniqueFiles = files.filter(
        (file) =>
          !prev.some(
            (p) =>
              p.name === file.name &&
              p.size === file.size &&
              p.lastModified === file.lastModified,
          ),
      );
      if (uniqueFiles.length === 0) return prev;
      const combined = [...prev, ...uniqueFiles];
      if (combined.length > 10) {
        toast.error("Max 10 attachments allowed");
        return prev;
      }
      const oversized = uniqueFiles.find((f) => f.size > 10 * 1024 * 1024);
      if (oversized) {
        toast.error(`"${oversized.name}" exceeds 10 MB limit`);
        return prev;
      }
      return combined;
    });
  };

  // ── Insert a hyperlink into the rich-text editor at the cursor position ──
  const insertLinkInEditor = (url: string, displayText: string) => {
    const editor = bodyEditorRef.current;
    if (!editor) return;
    editor.focus();
    const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#3b82f6;text-decoration:underline;">${displayText}</a>&nbsp;`;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const tmp = document.createElement("div");
      tmp.innerHTML = linkHtml;
      const frag = document.createDocumentFragment();
      while (tmp.firstChild) frag.appendChild(tmp.firstChild);
      range.insertNode(frag);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      editor.innerHTML += linkHtml;
    }
    // Sync React Hook Form value & clear errors
    setValue("bodyText", editor.innerText?.trim() || " ");
    clearErrors(["bodyText", "root" as any]);
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    addFiles(files);
    // reset so same file can be re-picked
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (idx: number) =>
    setAttachments((prev) => prev.filter((_, i) => i !== idx));

  const insertEmoji = (data: EmojiClickData) => {
    const editor = bodyEditorRef.current;
    if (!editor) return;
    editor.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const node = document.createTextNode(data.emoji);
      range.insertNode(node);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      editor.innerHTML += data.emoji;
    }
    // Sync React Hook Form value & clear errors
    setValue("bodyText", editor.innerText?.trim() || " ");
    clearErrors(["bodyText", "root" as any]);
    setShowEmoji(false);
  };

  const sanitizeEmails = (emailsStr: string | undefined | null) => {
    if (!emailsStr) return "";
    return emailsStr
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean)
      .join(",");
  };

  const onSubmit = (data: EmailFormValues) => {
    const fd = new FormData();

    // Read content from the rich-text editor (contentEditable div)
    const editorEl = bodyEditorRef.current;
    const sanitizedBodyText = (
      editorEl?.innerText ||
      data.bodyText ||
      ""
    ).trim();
    const editorBodyHtml = editorEl?.innerHTML?.trim() || "";

    // Sanitize inputs
    const sanitizedTo = sanitizeEmails(data.to);
    const sanitizedSubject = data.subject?.trim() || "";
    const sanitizedCc = sanitizeEmails(data.cc);
    const sanitizedBcc = sanitizeEmails(data.bcc);

    // Combine regular attachments with hidden forwarded attachments
    const allAttachments = [...attachments, ...forwardedAttachments];

    // ─── Attachments Validation & Binary Handling Layer ───
    allAttachments.forEach((file) => {
      console.log(
        `[DEBUG] Processing attachment: name="${file.name}", size=${file.size} bytes, type="${file.type}"`,
      );

      let fileToAppend = file;

      // Ensure PDF MIME type is correctly set
      const isPdfByName = file.name.toLowerCase().endsWith(".pdf");
      if (isPdfByName && file.type !== "application/pdf") {
        console.warn(
          `[DEBUG] Correcting mismatch MIME type for PDF "${file.name}" from "${file.type}" to "application/pdf"`,
        );

        // Re-wrap the binary data into a new File instance with explicit application/pdf MIME type
        fileToAppend = new File([file], file.name, {
          type: "application/pdf",
          lastModified: file.lastModified,
        });
      }

      fd.append("attachments", fileToAppend);
    });

    // ─── FormData Inspection before Mutation ───
    const attachedFiles = fd.getAll("attachments");
    console.log(
      `[DEBUG] FormData "attachments" payload contains ${attachedFiles.length} files:`,
    );
    attachedFiles.forEach((entry, idx) => {
      if (entry instanceof File) {
        console.log(
          `  - File #${idx + 1}: name="${entry.name}", size=${entry.size} bytes, type="${entry.type}"`,
        );
        if (
          entry.name.toLowerCase().endsWith(".pdf") &&
          entry.type !== "application/pdf"
        ) {
          console.error(
            `  [ERROR] File #${idx + 1} "${entry.name}" is a PDF but has incorrect type "${entry.type}".`,
          );
        }
      } else {
        console.log(`  - Entry #${idx + 1} is not a File instance:`, entry);
      }
    });
    const onSuccess = () => {
      setOpen(false);
    };

    if (composeMode === "reply" && composeData?.emailId) {
      if (sanitizedBodyText) fd.append("content", sanitizedBodyText);
      const originalHtml =
        composeData.originalHtml ||
        (composeData.originalText
          ? `<p>${composeData.originalText.replace(/\n/g, "<br/>")}</p>`
          : "");
      if (originalHtml) {
        const fullHtml = formatReplyEmail(
          sanitizedBodyText,
          originalHtml,
          composeData,
        );
        fd.append("bodyHtml", fullHtml);
      } else if (data.bodyHtml) {
        fd.append("bodyHtml", data.bodyHtml);
      }
      replyMutation.mutate(
        { id: composeData.emailId, formData: fd },
        {
          onSuccess,
          onError: (err: any) => handleServerErrors(err, ["bodyText"]),
        },
      );
    } else if (composeMode === "forward" && composeData?.emailId) {
      fd.append("to", sanitizedTo);
      fd.append("subject", data.subject || `Fwd: ${composeData.subject || ""}`);
      if (sanitizedBodyText) {
        fd.append("bodyText", sanitizedBodyText);
      }
      const originalHtml =
        composeData.originalHtml ||
        (composeData.originalText
          ? `<p>${composeData.originalText.replace(/\n/g, "<br/>")}</p>`
          : "");
      const fullHtml = formatForwardEmail(
        editorBodyHtml || sanitizedBodyText,
        originalHtml,
        composeData,
      );
      fd.append("bodyHtml", fullHtml);

      sendMutation.mutate(fd, {
        onSuccess,
        onError: (err: any) =>
          handleServerErrors(err, ["to", "subject", "bodyText"]),
      });
    } else {
      fd.append("to", sanitizedTo);
      fd.append("subject", sanitizedSubject);
      if (sanitizedCc) fd.append("cc", sanitizedCc);
      if (sanitizedBcc) fd.append("bcc", sanitizedBcc);
      if (sanitizedBodyText) {
        fd.append("bodyText", sanitizedBodyText);
      }
      if (editorBodyHtml) {
        fd.append("bodyHtml", editorBodyHtml);
      } else if (sanitizedBodyText) {
        fd.append(
          "bodyHtml",
          `<p>${sanitizedBodyText.replace(/\n/g, "<br/>")}</p>`,
        );
      }
      if (data.bodyHtml) fd.append("bodyHtml", data.bodyHtml);

      sendMutation.mutate(fd, {
        onSuccess,
        onError: (err: any) =>
          handleServerErrors(err, ["to", "subject", "cc", "bcc", "bodyText"]),
      });
    }
  };

  const isPending =
    sendMutation.isPending ||
    replyMutation.isPending ||
    forwardMutation.isPending;

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = form;

  return {
    isOpen,
    setOpen,
    composeMode,
    composeData,
    form,
    register,
    handleSubmit,
    clearErrors,
    reset,
    control,
    getValues,
    setValue,
    errors,
    attachments,
    setAttachments,
    fileInputRef,
    bodyEditorRef,
    insertLinkInEditor,
    showEmoji,
    setShowEmoji,
    emojiRef,
    showCc,
    setShowCc,
    showBcc,
    setShowBcc,
    handleAddFiles,
    addFiles,
    removeAttachment,
    insertEmoji,
    onSubmit,
    isPending,
    mailboxes,
  };
};
