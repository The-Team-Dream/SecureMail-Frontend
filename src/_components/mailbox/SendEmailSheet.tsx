"use client";

import React from "react";
import { Controller } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/_components/shared/Input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Paperclip, Smile, Link as LinkIcon, Image as ImageIcon, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";
import { Text } from "../shared/Text";
import { Icons } from "@/constants/icons";
import { Spinner } from "@/components/ui/spinner";
import { useComposeEmail, MOCK_ACCOUNTS } from "@/hooks/useComposeEmail";

// ─── Component ─────────────────────────────────────────────────────────────
export const ComposeEmailSheet = () => {
  const { resolvedTheme } = useTheme();
  
  const {
    isOpen,
    setOpen,
    composeMode,
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
  } = useComposeEmail();

  const titleMap = {
    new: "New Email",
    reply: "Reply",
    forward: "Forward Email",
  };

  return (
    <Sheet open={isOpen} onOpenChange={(v) => setOpen(v)}>
      <SheetContent
        className="w-full sm:max-w-2xl p-0 flex flex-col bg-background [&>button]:top-5 [&>button]:right-5 rounded-l-xl"
        side="right"
      >
        {/* ── Header ────────────────────────────────────────────────── */}
        <SheetHeader className="px-6 pt-6 pb-2 flex flex-row items-center justify-between shrink-0">
          <SheetTitle className="text-xl font-semibold text-primary-950">
            {titleMap[composeMode]}
          </SheetTitle>
        </SheetHeader>
        <hr className="border-primary-100 mx-6" />
        
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* From */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-primary-700 shrink-0">
                From <span className="text-error-500">*</span>
              </label>
              <div className="flex-1 w-full">
                <Controller
                  name="from"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full border-primary-100 rounded-xl">
                        <SelectValue placeholder="Select sender" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_ACCOUNTS.map((acc) => (
                          <SelectItem key={acc.id} value={acc.email}>
                            {acc.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.from && (
                  <Text color="error-500" size="sm">
                    {form.formState.errors.from.message}
                  </Text>
                )}
              </div>
            </div>

            {/* To */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-primary-700 shrink-0">
                To <span className="text-error-500">*</span>
              </label>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <div className="flex-1 w-full">
                    <Input
                      {...form.register("to")}
                      className="w-full"
                      placeholder="recipient@example.com"
                      error={form.formState.errors.to?.message}
                    />
                  </div>
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
                </div>
              </div>
            </div>

            {/* CC */}
            {showCc && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-primary-700">
                  CC
                </label>
                <div className="flex-1">
                  <Input
                    {...form.register("cc")}
                    className="w-full border-primary-200"
                    placeholder="cc@example.com, ..."
                  />
                </div>
              </div>
            )}

            {/* BCC */}
            {showBcc && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-primary-700">
                  BCC
                </label>
                <div className="flex-1">
                  <Input
                    {...form.register("bcc")}
                    className="w-full border-primary-200"
                    placeholder="bcc@example.com, ..."
                  />
                </div>
              </div>
            )}

            {/* Subject */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-primary-700 shrink-0">
                Subject <span className="text-error-500">*</span>
              </label>
              <div className="flex-1">
                <Input
                  {...form.register("subject")}
                  placeholder="Email subject..."
                  error={form.formState.errors.subject?.message}
                />
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-2 pt-1">
              <label className="text-sm font-medium text-primary-700 shrink-0">
                Your Message <span className="text-error-500">*</span>
              </label>
              <Controller
                name="bodyText"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Type your message here..."
                    className=""
                  />
                )}
              />
            </div>

            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 bg-primary-50 border border-primary-100 rounded-lg px-3 py-1.5 text-xs text-primary-700"
                  >
                    <Paperclip className="w-3 h-3 shrink-0" />
                    <Text as={"span"} className="max-w-[140px] truncate">
                      {file.name}
                    </Text>
                    <Text color={"primary-400"} as={"span"}>
                      ({(file.size / 1024).toFixed(0)} KB)
                    </Text>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="ml-1 text-primary-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                    <Icons.Sent className="w-4 h-4 text-background" />
                  </>
                )}
              </Button>

              {/* Toolbar icons */}
              <div className="flex items-center gap-0.5">
                {/* Attach file */}
                <Button
                  type="button"
                  variant="ghost"
                  size={"icon-sm"}
                  title="Attach file (max 10, 10 MB each)"
                  className="text-primary-500 hover:text-primary-900"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-5 h-5" />
                </Button>
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Insert emoji"
                    className={cn(
                      "text-primary-500 hover:text-primary-900",
                      showEmoji && "bg-primary-100 text-primary-900",
                    )}
                    onClick={() => setShowEmoji((v) => !v)}
                  >
                    <Smile className="w-5 h-5 text-primary-500 hover:text-primary-900" />
                  </Button>

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

                {/* Insert Link (UI only) */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  title="Insert link"
                  className="text-primary-500 hover:text-primary-900"
                  onClick={() => {
                    const url = window.prompt("Enter URL:");
                    if (url) {
                      const current = form.getValues("bodyText") ?? "";
                      form.setValue("bodyText", `${current} ${url}`);
                    }
                  }}
                >
                  <LinkIcon className="w-5 h-5" />
                </Button>

                {/* Insert Image (UI only) */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  title="Attach image"
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
                      setAttachments((prev) => {
                        const combined = [...prev, ...files];
                        if (combined.length > 10) {
                          toast.error("Max 10 attachments allowed");
                          return prev;
                        }
                        return combined;
                      });
                    };
                    imgInput.click();
                  }}
                >
                  <ImageIcon className="w-5 h-5" />
                </Button>
              </div>

              {/* Attachment count badge */}
              {attachments.length > 0 && (
                <span className="text-xs text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">
                  {attachments.length} file{attachments.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Discard */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="text-primary-400 hover:text-error-500 hover:bg-error-50 rounded-full"
              title="Discard draft"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
