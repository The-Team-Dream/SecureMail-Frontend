"use client";

import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/_components/shared/Input";
import { Textarea } from "@/_components/shared/Textarea";
import {
  Paperclip,
  Smile,
  Link as LinkIcon,
  Image as ImageIcon,
  X,
  FileText,
  FileCode,
  FileArchive,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  File as FileIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import BackEndError from "@/_components/shared/BackEndError";
import Error from "@/_components/shared/Error";
import dynamic from "next/dynamic";
import { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";
import { Text } from "@/_components/shared/Text";
import { Icons } from "@/constants/icons";
import { Spinner } from "@/components/ui/spinner";
import { useComposeEmail } from "@/hooks/useComposeEmail";
import { ActionButton } from "@/_components/shared/ActionButton";
import DOMPurify from "dompurify";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="w-[320px] h-[360px] flex items-center justify-center bg-background border border-primary-100 rounded-xl">
      <Spinner />
    </div>
  ),
});

// ─── Sub-Components ────────────────────────────────────────────────────────
const AttachmentCard = ({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) => {
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const [url, setUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isImage || isVideo) {
      const objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file, isImage, isVideo]);

  const { icon: Icon, color, bg } = getFileIcon(file.type, file.name);

  return (
    <div
      className={cn(
        "relative group w-24 h-24 rounded-xl overflow-hidden border border-primary-100 shadow-sm transition-all hover:border-primary-300 bg-background",
        !isImage && !isVideo && bg,
      )}
    >
      {isImage ? (
        <img
          src={url!}
          alt={file.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : isVideo ? (
        <div className="absolute inset-0 bg-primary-900 flex flex-col items-center justify-center gap-1">
          <FileVideo className="w-8 h-8 text-background/80" />
          <span className="text-[8px] text-background/60 px-1 truncate w-full text-center">
            Video
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-1.5 p-2">
          <Icon className={cn("w-8 h-8", color)} />
          <span className="text-[9px] font-medium text-primary-700 line-clamp-2 break-all leading-tight">
            {file.name}
          </span>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors pointer-events-none" />

      {/* Size Badge */}
      <div className="absolute bottom-0 left-0 right-0 bg-background/40 text-background text-[8px] py-0.5 text-center opacity-0 group-hover:opacity-100 transition-opacity">
        {(file.size / 1024).toFixed(0)} KB
      </div>

      {/* Delete Button */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 p-1 bg-background/90 rounded-full text-error-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-error-50 z-10"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────
const getFileIcon = (mimeType: string, fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (mimeType.startsWith("video/"))
    return { icon: FileVideo, color: "text-info-500", bg: "bg-info-50" };
  if (mimeType.startsWith("audio/"))
    return { icon: FileAudio, color: "text-warning-500", bg: "bg-warning-50" };

  if (mimeType === "application/pdf" || extension === "pdf")
    return { icon: FileText, color: "text-error-500", bg: "bg-error-50" };

  // Word
  if (
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ["doc", "docx"].includes(extension || "")
  )
    return { icon: FileText, color: "text-info-600", bg: "bg-info-50" };

  // Excel
  if (
    mimeType === "application/vnd.ms-excel" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    ["xls", "xlsx", "csv"].includes(extension || "")
  )
    return {
      icon: FileSpreadsheet,
      color: "text-secondary-600",
      bg: "bg-secondary-50",
    };

  // Zip/Archive
  if (
    mimeType === "application/zip" ||
    mimeType === "application/x-rar-compressed" ||
    ["zip", "rar", "7z", "tar", "gz"].includes(extension || "")
  )
    return {
      icon: FileArchive,
      color: "text-warning-600",
      bg: "bg-warning-50",
    };

  // Code
  if (
    [
      "js",
      "ts",
      "jsx",
      "tsx",
      "html",
      "css",
      "json",
      "py",
      "java",
      "c",
      "cpp",
    ].includes(extension || "")
  )
    return { icon: FileCode, color: "text-primary-600", bg: "bg-primary-50" };

  return { icon: FileIcon, color: "text-primary-500", bg: "bg-primary-50" };
};

const IsolatedHtml = ({ html }: { html: string }) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          // Adjust iframe height dynamically to match its inner content height
          const bodyHeight =
            doc.body?.scrollHeight || doc.documentElement.scrollHeight || 200;
          iframe.style.height = `${bodyHeight + 20}px`;
        }
      } catch (e) {
        console.error("Failed to resize iframe:", e);
      }
    };

    // Trigger calculation when the content document is updated
    iframe.addEventListener("load", handleLoad);

    // Fallback: trigger after 200ms to ensure lazy/styled rendering is calculated
    const timer = setTimeout(handleLoad, 200);

    return () => {
      iframe.removeEventListener("load", handleLoad);
      clearTimeout(timer);
    };
  }, [html]);

  const sanitized = DOMPurify.sanitize(html);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={sanitized}
      title="Original Message Preview"
      className="w-full border-0 min-h-[200px] max-h-[300px] overflow-y-auto rounded-lg"
      sandbox="allow-same-origin"
    />
  );
};

// ─── Component ─────────────────────────────────────────────────────────────
export const ComposeEmailSheet = () => {
  const { resolvedTheme } = useTheme();
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const linkInputRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        linkInputRef.current &&
        !linkInputRef.current.contains(e.target as Node)
      ) {
        setShowLinkInput(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const {
    isOpen,
    setOpen,
    composeMode,
    composeData,
    register,
    handleSubmit,
    errors,
    clearErrors,
    attachments,
    setAttachments,
    fileInputRef,
    bodyEditorRef,
    insertLinkInEditor,
    addFiles,
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
    control,
    getValues,
    setValue,
    onSubmit,
    isPending,
  } = useComposeEmail();

  const titleMap = {
    new: "Send Email",
    reply: "Reply",
    forward: "Forward Email",
  };

  return (
    <Sheet open={isOpen} onOpenChange={(v) => setOpen(v)}>
      <SheetContent
        className="w-full sm:max-w-2xl p-0 flex flex-col bg-background rounded-l-xl"
        side="right"
        showCloseButton={false}
      >
        {/* ── Header ────────────────────────────────────────────────── */}
        <SheetHeader className="px-6 pt-6 pb-2 flex flex-row items-center justify-between shrink-0">
          <SheetTitle className="text-xl font-semibold text-primary-950">
            {titleMap[composeMode]}
          </SheetTitle>
          <ActionButton
            label="Close"
            icon={<X className="w-5 h-5" />}
            onClick={() => setOpen(false)}
            className="text-primary-500 hover:text-primary-900"
          />
        </SheetHeader>
        <hr className="border-primary-100 mx-6" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* To (Hide in Reply) */}
            {composeMode !== "reply" && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-primary-700 shrink-0">
                  To <span className="text-error-500">*</span>
                </label>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <div className="flex-1 w-full">
                      <Input
                        {...register("to", {
                          onChange: () => clearErrors(["to", "root" as any]),
                        })}
                        className="w-full"
                        placeholder="recipient@example.com"
                        disabled={isPending}
                        error={errors.to?.message as string}
                      />
                    </div>
                    {composeMode === "new" && (
                      <div className="flex items-center gap-1 ml-1">
                        <button
                          type="button"
                          onClick={() => setShowCc((v) => !v)}
                          className="text-xs text-primary-500 hover:text-primary-800 font-medium px-1.5 py-0.5 rounded hover:bg-primary-50 transition-colors"
                        >
                          CC
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowBcc((v) => !v)}
                          className="text-xs text-primary-500 hover:text-primary-800 font-medium px-1.5 py-0.5 rounded hover:bg-primary-50 transition-colors"
                        >
                          BCC
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CC (New Only) */}
            {composeMode === "new" && showCc && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-primary-700">
                  CC
                </label>
                <div className="flex-1">
                  <Input
                    {...register("cc", {
                      onChange: () => clearErrors(["cc", "root" as any]),
                    })}
                    className="w-full border-primary-200"
                    placeholder="cc@example.com, ..."
                    disabled={isPending}
                    error={errors.cc?.message as string}
                  />
                </div>
              </div>
            )}

            {/* BCC (New Only) */}
            {composeMode === "new" && showBcc && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-primary-700">
                  BCC
                </label>
                <div className="flex-1">
                  <Input
                    {...register("bcc", {
                      onChange: () => clearErrors(["bcc", "root" as any]),
                    })}
                    className="w-full border-primary-200"
                    placeholder="bcc@example.com, ..."
                    disabled={isPending}
                    error={errors.bcc?.message as string}
                  />
                </div>
              </div>
            )}

            {/* Subject (New Only) */}
            {composeMode === "new" && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-primary-700 shrink-0">
                  Subject <span className="text-error-500">*</span>
                </label>
                <div className="flex-1">
                  <Input
                    {...register("subject", {
                      onChange: () => clearErrors(["subject", "root" as any]),
                    })}
                    placeholder="Email subject..."
                    disabled={isPending}
                    error={errors.subject?.message as string}
                  />
                </div>
              </div>
            )}

            {/* Body */}
            <div className="flex flex-col gap-2 pt-1">
              <label className="text-sm font-medium text-primary-700 shrink-0">
                {composeMode === "reply"
                  ? "Your Reply"
                  : composeMode === "forward"
                    ? "Message (Optional)"
                    : "Your Message"}{" "}
                {composeMode !== "forward" && (
                  <span className="text-error-500">*</span>
                )}
              </label>
              <div className="flex flex-col gap-1">
                {/* Rich-text contentEditable body editor */}
                <div
                  ref={bodyEditorRef}
                  contentEditable={!isPending}
                  suppressContentEditableWarning
                  onInput={(e) => {
                    const text = e.currentTarget.innerText?.trim() || "";
                    setValue("bodyText", text);
                    clearErrors(["bodyText", "root" as any]);
                  }}
                  onBlur={(e) => {
                    const text = e.currentTarget.innerText?.trim() || "";
                    setValue("bodyText", text, {
                      shouldValidate: true,
                      shouldTouch: true,
                    });
                  }}
                  data-placeholder={
                    composeMode === "reply"
                      ? "Type your reply..."
                      : composeMode === "forward"
                        ? "Add a message to this forward..."
                        : "Type your message here..."
                  }
                  className={cn(
                    "min-h-[220px] w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:border-primary-400 transition duration-500",
                    "text-primary-800 leading-relaxed wrap-break-word",
                    "before:pointer-events-none",
                    "empty:before:content-[attr(data-placeholder)]",
                    errors.bodyText
                      ? "border-error-500 before:text-error-500"
                      : "border-primary-100 before:text-primary-400",
                    isPending &&
                      "opacity-60 cursor-not-allowed pointer-events-none",
                  )}
                />
                <Error error={errors.bodyText?.message as string} />
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {attachments.map((file, idx) => (
                  <AttachmentCard
                    key={idx}
                    file={file}
                    onRemove={() => removeAttachment(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="px-4">
            <BackEndError
              error={
                errors.root?.message ? String(errors.root.message) : undefined
              }
            />
          </div>

          {/* ── Footer ──────────────────────────────────────────────── */}
          <div className="p-4 flex items-center justify-between bg-background shrink-0">
            <div className="flex items-center gap-2">
              {/* Send Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-[100px] h-[46px] rounded-lg"
              >
                {isPending ? (
                  <Spinner />
                ) : (
                  <>
                    <span>Send</span>
                    <Icons.Sent className="w-4 h-4 text-white" />
                  </>
                )}
              </Button>

              {/* Toolbar icons */}
              <div className="flex items-center gap-0.5">
                <ActionButton
                  label="Attach file (max 10, 10 MB each)"
                  className="text-primary-500 hover:text-primary-900"
                  onClick={() => fileInputRef.current?.click()}
                  icon={<Paperclip className="w-5 h-5" />}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleAddFiles}
                  accept="*/*"
                />

                {/* Emoji picker */}
                <div className="relative" ref={emojiRef}>
                  <ActionButton
                    label="Insert emoji"
                    className={cn(
                      "text-primary-500 hover:text-primary-900",
                      showEmoji && "bg-primary-100 text-primary-900",
                    )}
                    onClick={() => setShowEmoji((v) => !v)}
                    icon={<Smile className="w-5 h-5" />}
                  />

                  {showEmoji && (
                    <div className="absolute bottom-full mb-2 left-0 z-9999">
                      <EmojiPicker
                        onEmojiClick={insertEmoji}
                        theme={
                          resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT
                        }
                        searchPlaceholder="Search emoji..."
                        lazyLoadEmojis
                        height={360}
                        width={320}
                      />
                    </div>
                  )}
                </div>

                <div className="relative" ref={linkInputRef}>
                  <ActionButton
                    label="Insert link"
                    className="text-primary-500 hover:text-primary-900"
                    onClick={() => setShowLinkInput((v) => !v)}
                    icon={<LinkIcon className="w-5 h-5" />}
                  />
                  {showLinkInput && (
                    <div className="absolute bottom-full mb-2 left-0 z-50 bg-background p-3 rounded-xl border border-primary-200 shadow-xl flex flex-col gap-2 w-64">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-primary-500">
                          Text Display
                        </span>
                        <Input
                          placeholder="e.g. My Website"
                          value={linkText}
                          onChange={(e) => setLinkText(e.target.value)}
                          className="h-8 text-xs w-full"
                          autoFocus
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-primary-500">
                          Link URL
                        </span>
                        <Input
                          placeholder="https://example.com"
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          className="h-8 text-xs w-full"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (linkUrl) {
                                const displayText = linkText || linkUrl;
                                insertLinkInEditor(linkUrl, displayText);
                                setShowLinkInput(false);
                                setLinkText("");
                                setLinkUrl("");
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="flex justify-end gap-1.5 pt-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs px-2 text-primary-500"
                          onClick={() => {
                            setShowLinkInput(false);
                            setLinkText("");
                            setLinkUrl("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="h-7 text-xs px-2"
                          onClick={() => {
                            if (linkUrl) {
                              const displayText = linkText || linkUrl;
                              insertLinkInEditor(linkUrl, displayText);
                              setShowLinkInput(false);
                              setLinkText("");
                              setLinkUrl("");
                            }
                          }}
                        >
                          Insert
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Insert Image (UI only) */}
                <ActionButton
                  label="Attach image"
                  className="text-primary-500 hover:text-primary-900"
                  onClick={() => {
                    const imgInput = document.createElement("input");
                    imgInput.type = "file";
                    imgInput.accept = "image/*";
                    imgInput.multiple = true;
                    imgInput.onchange = (e) => {
                      const files = Array.from(
                        (e.target as HTMLInputElement).files ?? [],
                      );
                      addFiles(files);
                    };
                    imgInput.click();
                  }}
                  icon={<ImageIcon className="w-5 h-5" />}
                />
              </div>

              {/* Attachment count badge */}
              {attachments.length > 0 && (
                <span className="text-xs text-primary bg-background px-2 py-0.5 rounded-full border border-primary-100">
                  {attachments.length} file{attachments.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
