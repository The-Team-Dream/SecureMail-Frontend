"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMailStore } from "@/stores/useMailStore";
import { useParams } from "next/navigation";
import { useEmailActions } from "@/APIs/hooks/useEmails";
import toast from "react-hot-toast";
import { emailSchema, type EmailFormValues } from "@/schemas/SendEmail";
import { type EmojiClickData } from "emoji-picker-react";

import { useMailboxes } from "@/APIs/hooks/useMailboxes";
import type { Mailbox } from "@/APIs/types/Mailbox";


export const useComposeEmail = () => {
  const {
    isComposeOpen: isOpen,
    setComposeOpen: setOpen,
    composeMode,
    composeData,
  } = useMailStore();

  const { data: mailboxes = [] } = useMailboxes();
  
  // ── Form ──────────────────────────────────────────────────────────────
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      from: "",
      to: "",
      subject: "",
      cc: "",
      bcc: "",
      bodyText: "",
    },
  });

  const formFrom = form.watch("from");
  const params = useParams();

  // Find the selected mailbox based on the "from" email
  const selectedMailbox = mailboxes.find((m) => m.email === formFrom) || mailboxes[0];
  const mailboxIdToUse =
    selectedMailbox?.id ?? (params?.mailboxId as string);

  const { sendMutation, replyMutation, forwardMutation } =
    useEmailActions(mailboxIdToUse ?? "");

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
        from: formFrom || mailboxes[0]?.email || "",
        to: composeData?.to ?? "",
        subject:
          composeMode === "reply"
            ? `Re: ${composeData?.subject ?? ""}`
            : composeMode === "forward"
              ? `Fwd: ${composeData?.subject ?? ""}`
              : "",
        cc: "",
        bcc: "",
        bodyText:
          composeMode !== "new"
            ? `\n\n--- Original Message ---\n${composeData?.body ?? ""}`
            : "",
      });
      setAttachments([]);
      setShowEmoji(false);
      setShowCc(false);
      setShowBcc(false);
    }
  }, [isOpen, composeMode, composeData, form, mailboxes, formFrom]);

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
  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setAttachments((prev) => {
      const combined = [...prev, ...files];
      if (combined.length > 10) {
        toast.error("Max 10 attachments allowed");
        return prev;
      }
      const oversized = files.find((f) => f.size > 10 * 1024 * 1024);
      if (oversized) {
        toast.error(`"${oversized.name}" exceeds 10 MB limit`);
        return prev;
      }
      return combined;
    });
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

    fd.append("to", sanitizedTo);
    fd.append("subject", sanitizedSubject);
    if (sanitizedCc) fd.append("cc", sanitizedCc);
    if (sanitizedBcc) fd.append("bcc", sanitizedBcc);
    if (sanitizedBodyText) fd.append("bodyText", sanitizedBodyText);

    attachments.forEach((f) => fd.append("attachments", f));

    if (composeMode === "reply" && composeData?.emailId) {
      replyMutation.mutate(
        { id: composeData.emailId, formData: fd },
        { onSuccess: () => setOpen(false) },
      );
    } else if (composeMode === "forward" && composeData?.emailId) {
      forwardMutation.mutate(
        { id: composeData.emailId, formData: fd },
        { onSuccess: () => setOpen(false) },
      );
    } else {
      sendMutation.mutate(fd, {
        onSuccess: () => setOpen(false),
        onError: (err: any) => {
          const message = err?.response?.data?.message || err?.message || "Failed to send email";
          toast.error(message);
        },
      });
    }
  };

  const isPending =
    sendMutation.isPending ||
    replyMutation.isPending ||
    forwardMutation.isPending;

  return {
    isOpen,
    setOpen,
    composeMode,
    composeData,
    form,
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
    removeAttachment,
    insertEmoji,
    onSubmit,
    isPending,
    mailboxes,
  };
};
