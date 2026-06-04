"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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

import { useMailboxes } from "@/APIs/hooks/mailboxes";
import { useServerErrors } from "@/utils/form-utils";

export const useComposeEmail = () => {
  const {
    isComposeOpen: isOpen,
    setComposeOpen: setOpen,
    composeMode,
    composeData,
  } = useMailStore();
  const router = useRouter();
  const params = useParams();
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        subject: "",
        cc: "",
        bcc: "",
        bodyText: composeMode === "reply" ? (composeData?.body ?? "") : "",
        bodyHtml: "",
      } as EmailFormValues);
      setAttachments([]);
      setShowEmoji(false);
      setShowCc(false);
      setShowBcc(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, composeMode, composeData, mailboxes]);

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
        (file) => !prev.some((p) => p.name === file.name && p.size === file.size && p.lastModified === file.lastModified)
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

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    addFiles(files);
    // reset so same file can be re-picked
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (idx: number) =>
    setAttachments((prev) => prev.filter((_, i) => i !== idx));

  const insertEmoji = (data: EmojiClickData) => {
    const current = form.getValues("bodyText") ?? "";
    form.setValue("bodyText", current + data.emoji);
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

    // Sanitize inputs
    const sanitizedTo = sanitizeEmails(data.to);
    const sanitizedSubject = data.subject?.trim() || "";
    const sanitizedCc = sanitizeEmails(data.cc);
    const sanitizedBcc = sanitizeEmails(data.bcc);
    const sanitizedBodyText = data.bodyText?.trim() || "";

    attachments.forEach((f) => fd.append("attachments", f));
    const onSuccess = () => {
      setOpen(false);
      // Redirect to sent folder to see the sent email
      router.push(`/mailboxes/${mailboxIdToUse}/sent`);
    };

    if (composeMode === "reply" && composeData?.emailId) {
      if (sanitizedBodyText) fd.append("content", sanitizedBodyText);
      const originalHtml = composeData.originalHtml || (composeData.originalText ? `<p>${composeData.originalText.replace(/\n/g, "<br/>")}</p>` : "");
      if (originalHtml) {
        const fullHtml = formatReplyEmail(sanitizedBodyText, originalHtml, composeData);
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
      const originalHtml = composeData.originalHtml || (composeData.originalText ? `<p>${composeData.originalText.replace(/\n/g, "<br/>")}</p>` : "");
      const fullHtml = formatForwardEmail(sanitizedBodyText, originalHtml, composeData);
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
        if (!data.bodyHtml) {
          fd.append(
            "bodyHtml",
            `<p>${sanitizedBodyText.replace(/\n/g, "<br/>")}</p>`,
          );
        }
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