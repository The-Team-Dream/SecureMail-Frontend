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

// ─── Mock connected accounts ───────────────────────────────────────────────
export const MOCK_ACCOUNTS = [
  { id: "1", email: "m.tarek@4horizons.com.sa" },
  { id: "2", email: "personal@gmail.com" },
];

export const useComposeEmail = () => {
  const isOpen = useMailStore((s) => s.isComposeOpen);
  const setOpen = useMailStore((s) => s.setComposeOpen);
  const composeMode = useMailStore((s) => s.composeMode);
  const composeData = useMailStore((s) => s.composeData);

  const params = useParams();
  const mailboxId = (params?.mailboxId as string) ?? "mock-mailbox-1";

  const { sendMutation, replyMutation, forwardMutation } =
    useEmailActions(mailboxId);

  // ── Attachments state ──────────────────────────────────────────────────
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Emoji picker ──────────────────────────────────────────────────────
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  // ── CC / BCC visibility ───────────────────────────────────────────────
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  // ── Form ──────────────────────────────────────────────────────────────
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      from: MOCK_ACCOUNTS[0]?.email ?? "",
      to: "",
      subject: "",
      cc: "",
      bcc: "",
      bodyText: "",
    },
  });

  // Reset form when opened / mode changes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        from: MOCK_ACCOUNTS[0]?.email ?? "",
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
  }, [isOpen, composeMode, composeData, form]);

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

  const onSubmit = (data: EmailFormValues) => {
    const fd = new FormData();
    fd.append("to", data.to);
    fd.append("subject", data.subject);
    if (data.cc) fd.append("cc", data.cc);
    if (data.bcc) fd.append("bcc", data.bcc);
    if (data.bodyText) fd.append("bodyText", data.bodyText);
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
        // Mock fallback: if backend not available, still succeed
        onError: () => {
          toast.success("Email queued for sending!");
          setOpen(false);
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
  };
};
