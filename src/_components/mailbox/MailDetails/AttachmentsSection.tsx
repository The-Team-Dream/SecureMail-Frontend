"use client";

import React from "react";
import {
  Download,
  FileVideo,
  FileAudio,
  FileText,
  FileSpreadsheet,
  FileArchive,
  File as FileIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/_components/shared/Text";
import { cn } from "@/lib/utils";
import { baseURL } from "@/lib/axios";
import { useAuthenticatedImage } from "@/APIs/hooks/emails/useAuthenticatedImage";
import type { Attachment } from "@/APIs/types/Email";

interface AttachmentsSectionProps {
  attachments: Attachment[];
  mailboxId: string;
  emailId: string;
  pendingDownloads: Record<string, boolean>;
  handleDownload: (
    attId: string,
    filename: string,
    url?: string,
  ) => Promise<void>;
}

const AuthenticatedImage = ({
  url,
  alt,
  className,
}: {
  url: string;
  alt: string;
  className: string;
}) => {
  const { data: imgSrc, isLoading } = useAuthenticatedImage(url);

  if (isLoading || !imgSrc) {
    return (
      <div
        className={cn(className, "animate-pulse bg-primary-100 min-h-[100px]")}
      />
    );
  }

  return <img src={imgSrc} alt={alt} className={className} />;
};

const getAttachmentIcon = (mimeType?: string, fileName?: string) => {
  const extension = fileName?.split(".").pop()?.toLowerCase();
  if (
    mimeType?.startsWith("video/") ||
    ["mp4", "mov", "avi", "webm"].includes(extension || "")
  )
    return <FileVideo className="w-4 h-4 text-info-500 shrink-0" />;
  if (
    mimeType?.startsWith("audio/") ||
    ["mp3", "wav", "ogg"].includes(extension || "")
  )
    return <FileAudio className="w-4 h-4 text-warning-500 shrink-0" />;
  if (mimeType === "application/pdf" || extension === "pdf")
    return <FileText className="w-4 h-4 text-error-500 shrink-0" />;
  if (
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ["doc", "docx"].includes(extension || "")
  )
    return <FileText className="w-4 h-4 text-blue-600 shrink-0" />;
  if (
    mimeType === "application/vnd.ms-excel" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    ["xls", "xlsx", "csv"].includes(extension || "")
  )
    return <FileSpreadsheet className="w-4 h-4 text-success-600 shrink-0" />;
  if (
    mimeType === "application/zip" ||
    mimeType === "application/x-rar-compressed" ||
    ["zip", "rar", "7z", "tar", "gz"].includes(extension || "")
  )
    return <FileArchive className="w-4 h-4 text-warning-600 shrink-0" />;
  return <FileIcon className="w-4 h-4 text-primary-500 shrink-0" />;
};

export const AttachmentsSection = ({
  attachments,
  mailboxId,
  emailId,
  pendingDownloads,
  handleDownload,
}: AttachmentsSectionProps) => {
  if (!attachments || attachments.length === 0) return null;

  const isImageAttachment = (att: any) => {
    if (att.contentType?.startsWith("image/")) return true;
    const ext = att.filename?.split(".").pop()?.toLowerCase();
    return ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext || "");
  };

  const isWordAttachment = (att: any) => {
    const ext = att.filename?.split(".").pop()?.toLowerCase();
    return ["doc", "docx"].includes(ext || "");
  };

  const uniqueAttachments = Array.from(
    new Map(
      attachments.map((att) => {
        const attId = String(
          att.id ??
            (att as any).attachmentId ??
            (att as any).attachment_id ??
            (att as any)._id ??
            (att as any).fileId ??
            "",
        );
        const attFilename = att.filename || attId;
        return [attFilename, att];
      }),
    ).values(),
  );

  const imageAtts = uniqueAttachments.filter(isImageAttachment);
  const wordAtts = uniqueAttachments.filter(isWordAttachment);
  const otherAtts = uniqueAttachments.filter(
    (att: any) => !isImageAttachment(att) && !isWordAttachment(att),
  );

  return (
    <div className="mt-6 space-y-6">
      {/* Inline images rendered with AuthenticatedImage component */}
      {imageAtts.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {imageAtts.map((att: any) => {
            const attId = String(
              att.id ??
                att.attachmentId ??
                att.attachment_id ??
                att._id ??
                att.fileId ??
                "",
            );
            const attUrl = att.url || att.path;
            const defaultUrl = `${baseURL}/mailboxes/${mailboxId}/emails/${emailId}/attachments/${attId}/download`;
            const targetUrl = attUrl || defaultUrl;
            const isDownloading = pendingDownloads[attId];
            return (
              <div
                key={attId}
                className="relative group/image w-[280px] h-[180px] rounded-xl overflow-hidden border border-primary-200 shadow-xs cursor-pointer"
              >
                <AuthenticatedImage
                  url={targetUrl}
                  alt={att.filename}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-105"
                />
                {/* Glassmorphic hover overlay */}
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={isDownloading}
                    className="bg-white/90 text-primary-900 hover:bg-white hover:scale-105 transition-all duration-200 font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(attId, att.filename, attUrl);
                    }}
                  >
                    {isDownloading ? (
                      <div className="w-4 h-4 border-2 border-primary-900 border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Download className="w-4 h-4 mr-2 text-black" />
                    )}
                    <span className="text-black font-semibold">Download</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Word Documents */}
      {wordAtts.length > 0 && (
        <div className="space-y-3 pt-2">
          <Text
            size="sm"
            font="bold"
            className="text-primary-700 uppercase tracking-wider"
          >
            Documents
          </Text>
          <div className="flex flex-wrap gap-4">
            {wordAtts.map((att: any) => {
              const attId = String(
                att.id ??
                  att.attachmentId ??
                  att.attachment_id ??
                  att._id ??
                  att.fileId ??
                  "",
              );
              const attUrl = att.url || att.path;
              const isDownloading = pendingDownloads[attId];
              return (
                <div
                  key={attId}
                  onClick={() =>
                    !isDownloading &&
                    handleDownload(attId, att.filename, attUrl)
                  }
                  className={cn(
                    "relative w-72 h-44 rounded-xl border border-primary-200 shadow-xs overflow-hidden bg-zinc-50 flex flex-col group cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all duration-300",
                    isDownloading && "pointer-events-none opacity-80",
                  )}
                >
                  {/* Dynamic Document Page Preview */}
                  {(() => {
                    const name = att.filename || "document";
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
                    const titleLine = nameWithoutExt.slice(0, 22);
                    const subLine =
                      nameWithoutExt.length > 10
                        ? nameWithoutExt
                            .slice(Math.floor(nameWithoutExt.length / 2))
                            .slice(0, 18)
                        : "Document";
                    const lines = Array.from(
                      { length: 6 },
                      (_, i) => lineWidths[(hash + i * 3) % lineWidths.length],
                    );
                    return (
                      <div className="flex-1 bg-white p-3 flex flex-col gap-1 overflow-hidden select-none">
                        <span className="text-[9px] font-bold text-blue-800 tracking-tight truncate">
                          {titleLine}
                        </span>
                        <span className="text-[7px] font-semibold text-slate-500 tracking-tight truncate">
                          {subLine}
                        </span>
                        <div
                          className={`w-full h-1 ${accent} rounded-[1px] mt-0.5 mb-1 opacity-70`}
                        />
                        <div className="flex flex-col gap-0.5 flex-1">
                          {lines.map((w, i) => (
                            <div
                              key={i}
                              className={`${w} h-0.5 bg-slate-200 rounded-[1px]`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Bottom Dark Bar */}
                  <div className="h-12 bg-[#121212] flex items-center justify-between px-3 relative">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white font-extrabold text-[12px] shadow-sm select-none group">
                        {isDownloading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          "W"
                        )}
                      </div>
                      <Text className="text-white text-xs font-semibold max-w-[180px] truncate">
                        {att.filename}
                      </Text>
                    </div>

                    <div className="absolute right-6 top-0 bottom-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {isDownloading ? (
                        <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 tex-white group-hover:text-blue-400" />
                      )}
                    </div>

                    <svg
                      className="absolute bottom-0 right-0 w-5 h-5 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <polygon points="24,24 24,0 0,24" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Non-image other file chips */}
      {otherAtts.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {otherAtts.map((att: any) => {
            const attId = String(
              att.id ??
                att.attachmentId ??
                att.attachment_id ??
                att._id ??
                att.fileId ??
                "",
            );
            const attUrl = att.url || att.path;
            const isDownloading = pendingDownloads[attId];
            return (
              <div
                key={attId}
                className="flex items-center gap-2 border border-primary-200 px-3.5 py-2 rounded-xl bg-primary-50 hover:bg-primary-100/50 transition-colors"
              >
                {getAttachmentIcon(att.contentType, att.filename)}
                <Text
                  size="sm"
                  className="max-w-[180px] truncate font-medium text-primary-800"
                >
                  {att.filename}
                </Text>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  disabled={isDownloading}
                  onClick={() => handleDownload(attId, att.filename, attUrl)}
                  className="text-primary-600 hover:text-primary-900"
                >
                  {isDownloading ? (
                    <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 text-black" />
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
