"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog as DialogPrimitive } from "radix-ui";
import {
  X,
  Download,
  ImageIcon,
  FileSpreadsheet,
  FileArchive,
  File as FileIcon,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { FaFileWord, FaRegFilePdf } from "react-icons/fa";
import Cookies from "js-cookie";
import { baseURL } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Text } from "@/_components/shared/Text";
import { emailsApi } from "@/APIs/features/emails";
import { toast } from "sonner";
import { useEmailDetails } from "@/APIs/hooks/emails";

interface Attachment {
  id: string | number;
  filename: string;
  contentType?: string;
  size: number;
  url?: string;
}

interface CustomAttachment extends Attachment {
  attachmentId?: string;
  fileId?: string;
  path?: string;
}

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: Attachment | null;
  mailboxId: string;
  emailId: string;
}

const formatBytes = (bytes?: number) => {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return "";
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileIcon = (filename: string, contentType?: string) => {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const ct = (contentType || "").toLowerCase();

  if (
    ct.startsWith("image/") ||
    ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)
  ) {
    return <ImageIcon className="w-16 h-16 text-primary-500" />;
  }
  if (ct === "application/pdf" || ext === "pdf") {
    return <FaRegFilePdf className="w-16 h-16 text-error-500" />;
  }
  if (["doc", "docx"].includes(ext)) {
    return <FaFileWord className="w-16 h-16 text-blue-600" />;
  }
  if (["xls", "xlsx", "csv"].includes(ext)) {
    return <FileSpreadsheet className="w-16 h-16 text-success-600" />;
  }
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
    return <FileArchive className="w-16 h-16 text-warning-600" />;
  }
  return <FileIcon className="w-16 h-16 text-primary-500" />;
};

export const FilePreviewModal = ({
  isOpen,
  onClose,
  attachment,
  mailboxId,
  emailId,
}: FilePreviewModalProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: email, refetch: refetchEmail, isRefetching } = useEmailDetails(mailboxId, emailId);
  const isAnalysisPending = email?.analysisStatus === "PENDING";

  useEffect(() => {
    if (!isOpen || !attachment) {
      setPreviewUrl(null);
      setError(null);
      return;
    }

    if (isAnalysisPending) {
      setPreviewUrl(null);
      setError(null);
      return;
    }

    const ext = attachment.filename.split(".").pop()?.toLowerCase() || "";
    const ct = (attachment.contentType || "").toLowerCase();
    const isImage =
      ct.startsWith("image/") ||
      ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext);
    const isPdf = ct === "application/pdf" || ext === "pdf";

    if (!isImage && !isPdf) {
      setPreviewUrl(null);
      setError(null);
      return;
    }

    const attId = String(
      attachment.id ??
        (attachment as CustomAttachment).attachmentId ??
        (attachment as CustomAttachment).fileId ??
        "",
    );
    const attUrl = attachment.url || (attachment as CustomAttachment).path;
    const defaultUrl = `${baseURL}/mailboxes/${mailboxId}/emails/${emailId}/attachments/${attId}/download`;
    const url = attUrl || defaultUrl;

    let isMounted = true;
    let createdUrl: string | null = null;

    const loadPreview = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = Cookies.get("token");
        const headers: HeadersInit = {};
        if (token && (!url.startsWith("http") || url.includes("/mailboxes/"))) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(url, { headers });
        if (!response.ok) {
          const errorText = await response.text();
          let message = "Failed to load preview data";
          try {
            const parsed = JSON.parse(errorText);
            if (parsed.message) {
              message = parsed.message;
            }
          } catch {
            // ignore
          }
          throw new Error(message);
        }

        const blob = await response.blob();
        if (isMounted) {
          createdUrl = URL.createObjectURL(blob);
          setPreviewUrl(createdUrl);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || "Failed to load file preview");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPreview();

    return () => {
      isMounted = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [isOpen, attachment, mailboxId, emailId, isAnalysisPending]);

  const handleDownload = async () => {
    if (!attachment) return;
    setIsDownloading(true);
    const attId = String(
      attachment.id ??
        (attachment as CustomAttachment).attachmentId ??
        (attachment as CustomAttachment).fileId ??
        "",
    );
    const attUrl = attachment.url || (attachment as CustomAttachment).path;
    try {
      await emailsApi.downloadAttachment(
        mailboxId,
        emailId,
        attId,
        attachment.filename,
        attUrl,
      );
    } catch (e: any) {
      console.error(e);
      if (e?.message?.toLowerCase().includes("undergoing security analysis")) {
        toast.warning(
          "The file is still being scanned for security. Please wait a moment.",
        );
      } else {
        toast.error(e?.message || "Failed to download file");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  if (!attachment) return null;

  const ext = attachment.filename.split(".").pop()?.toLowerCase() || "";
  const ct = (attachment.contentType || "").toLowerCase();
  const isImage =
    ct.startsWith("image/") ||
    ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext);
  const isPdf = ct === "application/pdf" || ext === "pdf";
  const isWord = ["doc", "docx"].includes(ext);
  const hasPreview = (isImage || isPdf) && !error;

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild>
              <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] p-4 focus:outline-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                  className="relative overflow-hidden rounded-2xl bg-background border border-primary-200/50 shadow-2xl flex flex-col max-h-[85vh]"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-5 border-b border-primary-100 bg-background z-10">
                    <div className="flex flex-col min-w-0 pr-8">
                      <div className="flex items-center gap-2">
                        <DialogPrimitive.Title className="text-lg font-bold text-primary-950 truncate">
                          {attachment.filename}
                        </DialogPrimitive.Title>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => refetchEmail()}
                          disabled={isRefetching}
                          className="h-8 w-8 rounded-full text-primary-500 hover:text-primary-900 hover:bg-primary-50 cursor-pointer shrink-0"
                          title="Refresh analysis status"
                        >
                          <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
                        </Button>
                      </div>
                      <span className="text-xs text-primary-400">
                        {formatBytes(attachment.size)}
                      </span>
                    </div>
                    <DialogPrimitive.Close asChild>
                      <button
                        className="rounded-full p-2 text-primary-400 hover:bg-primary-50 hover:text-primary-900 transition-colors cursor-pointer"
                        aria-label="Close"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </DialogPrimitive.Close>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center min-h-[350px] bg-primary-50/10">
                    {isAnalysisPending ? (
                      <div className="flex flex-col items-center gap-4 text-center max-w-md p-6 bg-warning-50/50 rounded-xl border border-warning-200">
                        <Loader2 className="w-10 h-10 text-warning-500 animate-spin" />
                        <div className="space-y-1">
                          <Text font="bold" className="text-warning-800">
                            Security Analysis in Progress
                          </Text>
                          <Text size="xs" className="text-warning-600">
                            The file is still being scanned for security. Please wait a moment.
                          </Text>
                        </div>
                        <Button
                          onClick={() => refetchEmail()}
                          disabled={isRefetching}
                          className="bg-warning-600 hover:bg-warning-700 text-white font-semibold rounded-xl cursor-pointer"
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
                          Check Status
                        </Button>
                      </div>
                    ) : isLoading ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <Text size="sm" color="primary-500" font="medium">
                          Loading preview...
                        </Text>
                      </div>
                    ) : error ? (
                      <div className="flex flex-col items-center gap-4 text-center max-w-md p-6 bg-error-50/50 rounded-xl border border-error-100">
                        <AlertTriangle className="w-10 h-10 text-error-500" />
                        <div className="space-y-1">
                          <Text font="bold" className="text-error-800">
                            Failed to Load Preview
                          </Text>
                          <Text size="xs" className="text-error-600">
                            {error}
                          </Text>
                        </div>
                        <Button
                          onClick={handleDownload}
                          disabled={isDownloading}
                          className="bg-error-600 hover:bg-error-700 text-white font-semibold rounded-xl"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download File to View
                        </Button>
                      </div>
                    ) : hasPreview && previewUrl ? (
                      isImage ? (
                        <div className="relative max-w-full max-h-[55vh] flex items-center justify-center p-2">
                          <img
                            src={previewUrl}
                            alt={attachment.filename}
                            className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-md border border-primary-200"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-[55vh] rounded-lg overflow-hidden border border-primary-200 shadow-inner">
                          <embed
                            src={previewUrl}
                            type="application/pdf"
                            className="w-full h-full"
                          />
                        </div>
                      )
                    ) : isWord ? (
                      // Word Document Mock Thumbnail Preview
                      (() => {
                        const name = attachment.filename || "document";
                        const nameWithoutExt = name.replace(/\.[^.]+$/, "");
                        const hash = name
                          .split("")
                          .reduce(
                            (acc: number, c: string) => acc + c.charCodeAt(0),
                            0,
                          );
                        const lineWidths = [
                          "w-full",
                          "w-3/4",
                          "w-5/6",
                          "w-2/3",
                          "w-1/2",
                          "w-4/5",
                        ];
                        const accentColors = [
                          "bg-blue-300",
                          "bg-emerald-300",
                          "bg-violet-300",
                          "bg-amber-300",
                          "bg-rose-300",
                          "bg-cyan-300",
                        ];
                        const accent = accentColors[hash % accentColors.length];
                        const titleLine = nameWithoutExt.slice(0, 30);
                        const subLine =
                          nameWithoutExt.length > 15
                            ? nameWithoutExt
                                .slice(Math.floor(nameWithoutExt.length / 2))
                                .slice(0, 24)
                            : "Word Document";
                        const lines = Array.from(
                          { length: 10 },
                          (_, i) =>
                            lineWidths[(hash + i * 3) % lineWidths.length],
                        );

                        return (
                          <div className="flex flex-col items-center select-none text-left">
                            <div className="w-64 h-80 sm:w-72 sm:h-[350px] bg-white p-5 sm:p-6 shadow-lg rounded-xl border border-primary-200/60 flex flex-col gap-2 overflow-hidden mb-5">
                              <span className="text-[13px] font-bold text-blue-800 tracking-tight truncate">
                                {titleLine}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500 tracking-tight truncate">
                                {subLine}
                              </span>
                              <div
                                className={`w-full h-1.5 ${accent} rounded-[1.5px] mt-0.5 mb-2 opacity-80`}
                              />
                              <div className="flex flex-col gap-1.5 flex-1">
                                {lines.map((w, i) => (
                                  <div
                                    key={i}
                                    className={`${w} h-1 bg-slate-200 rounded-[1px]`}
                                  />
                                ))}
                              </div>
                            </div>

                            <Text
                              font="bold"
                              size="lg"
                              className="text-primary-950 mb-1 font-bold text-center max-w-sm truncate"
                            >
                              {attachment.filename}
                            </Text>
                            <Text
                              size="xs"
                              color="primary-500"
                              className="mb-6 max-w-sm px-4 text-center"
                            >
                              Word document preview is not supported directly in
                              browser for safety. Please download to view.
                            </Text>
                            <Button
                              onClick={handleDownload}
                              disabled={isDownloading || isAnalysisPending || isRefetching}
                              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl px-6 py-2.5 shadow-lg shadow-primary-200 cursor-pointer"
                            >
                              {isDownloading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4 mr-2" />
                              )}
                              Download File
                            </Button>
                          </div>
                        );
                      })()
                    ) : (
                      // Fallback for zip or other formats
                      <div className="flex flex-col items-center justify-center text-center p-8 bg-background border border-primary-200/50 rounded-2xl max-w-md shadow-sm">
                        <div className="p-4 bg-primary-50 rounded-full mb-4">
                          {getFileIcon(
                            attachment.filename,
                            attachment.contentType,
                          )}
                        </div>
                        <Text
                          font="bold"
                          size="lg"
                          className="text-primary-950 mb-2"
                        >
                          No Preview Available
                        </Text>
                        <Text
                          size="sm"
                          color="primary-500"
                          className="mb-6 px-4"
                        >
                          Previews are not supported for this file type (
                          {ext.toUpperCase() || "unknown"}). You can safely
                          download and open the file locally.
                        </Text>
                        <Button
                          onClick={handleDownload}
                          disabled={isDownloading || isAnalysisPending || isRefetching}
                          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl px-6 py-2.5 shadow-lg shadow-primary-200 cursor-pointer"
                        >
                          {isDownloading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4 mr-2" />
                          )}
                          Download File
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  {hasPreview && (
                    <div className="flex justify-end gap-3 p-5 border-t border-primary-100 bg-primary-50/20">
                      <DialogPrimitive.Close asChild>
                        <Button
                          variant="ghost"
                          className="rounded-xl px-4 py-2 font-medium hover:bg-primary-100"
                        >
                          Close
                        </Button>
                      </DialogPrimitive.Close>
                      <Button
                        onClick={handleDownload}
                        disabled={isDownloading || isAnalysisPending || isRefetching}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl px-5 shadow-lg shadow-primary-100 cursor-pointer"
                      >
                        {isDownloading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4 mr-2" />
                        )}
                        Download
                      </Button>
                    </div>
                  )}
                </motion.div>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};
