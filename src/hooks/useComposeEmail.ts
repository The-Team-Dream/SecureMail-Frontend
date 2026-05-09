"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMailStore } from "@/stores/useMailStore";
import { useParams, useRouter } from "next/navigation";
import { useEmailActions } from "@/APIs/hooks/useEmails";
import toast from "react-hot-toast";
import { emailSchema, type EmailFormValues } from "@/schemas/SendEmail";
import { type EmojiClickData } from "emoji-picker-react";

import { useMailboxes } from "@/APIs/hooks/useMailboxes";
import { useServerErrors } from "@/utils/form-utils";

export const useComposeEmail = () => {
  const {
    isComposeOpen: isOpen,
    setComposeOpen: setOpen,
    composeMode,
    composeData,
  } = useMailStore();
  const router = useRouter();

  const { data: mailboxes = [] } = useMailboxes();

  // ── Form ──────────────────────────────────────────────────────────────
  const form = useForm<EmailFormValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(emailSchema),
    defaultValues: {
      mode: composeMode,
      from: "",
      to: "",
      subject: "",
      cc: "",
      bcc: "",
      bodyText: "",
      bodyHtml: "",
    } as any,
  });

  const { handleServerErrors } = useServerErrors<EmailFormValues>(
    form.setError,
  );

  const formFrom = form.watch("from");
  const params = useParams();

  // Find the selected mailbox based on the "from" ID
  const selectedMailbox =
    mailboxes.find((m) => m.id.toString() === formFrom) ||
    mailboxes.find((m) => m.id.toString() === params?.mailboxId) ||
    mailboxes[0];
  const mailboxIdToUse =
    selectedMailbox?.id?.toString() || (params?.mailboxId as string);

  const { sendMutation, replyMutation, forwardMutation } = useEmailActions(
    mailboxIdToUse ?? "",
  );

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
      // Determine the initial mailbox ID
      const initialMailboxId =
        mailboxes
          .find((m) => m.id.toString() === params?.mailboxId)
          ?.id?.toString() ||
        mailboxes[0]?.id?.toString() ||
        "";

      form.reset({
        mode: composeMode,
        from: initialMailboxId,
        to: composeData?.to ?? "",
        subject: "",
        cc: "",
        bcc: "",
        bodyText: "",
        bodyHtml: (composeData as any)?.bodyHtml ?? "",
      } as any);
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

    attachments.forEach((f) => fd.append("attachments", f));
    const onSuccess = () => {
      setOpen(false);
      // Redirect to sent folder to see the sent email
      router.push(`/mailboxes/${mailboxIdToUse}/sent`);
    };

    if (composeMode === "reply" && composeData?.emailId) {
      if (sanitizedBodyText) fd.append("content", sanitizedBodyText);
      if (data.bodyHtml) fd.append("bodyHtml", data.bodyHtml);
      replyMutation.mutate(
        { id: composeData.emailId, formData: fd },
        {
          onSuccess,
          onError: (err: any) => handleServerErrors(err, ["bodyText"]),
        },
      );
    } else if (composeMode === "forward" && composeData?.emailId) {
      fd.append("to", sanitizedTo);
      if (sanitizedBodyText) fd.append("message", sanitizedBodyText);
      if (data.bodyHtml) fd.append("bodyHtml", data.bodyHtml);
      forwardMutation.mutate(
        { id: composeData.emailId, formData: fd },
        {
          onSuccess,
          onError: (err: any) => handleServerErrors(err, ["to", "bodyText"]),
        },
      );
    } else {
      fd.append("to", sanitizedTo);
      fd.append("subject", sanitizedSubject);
      if (sanitizedCc) fd.append("cc", sanitizedCc);
      if (sanitizedBcc) fd.append("bcc", sanitizedBcc);
      if (sanitizedBodyText) fd.append("bodyText", sanitizedBodyText);

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
