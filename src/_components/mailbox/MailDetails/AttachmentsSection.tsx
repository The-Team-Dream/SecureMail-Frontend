"use client";

import React from "react";
import {
  Download,
  FileVideo,
  FileAudio,
  FileText,
  FileSpreadsheet,
  FileArchive,
  FileCode,
  File as FileIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/_components/shared/Text";
import { cn } from "@/lib/utils";
import { baseURL } from "@/lib/axios";
import { useAuthenticatedImage } from "@/APIs/hooks/emails/useAuthenticatedImage";
import type { Attachment } from "@/APIs/types/Email";
import { FaFileWord, FaRegFilePdf } from "react-icons/fa";

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
  onPreviewAttachment?: (attachment: Attachment) => void;
  analysisStatus?: string;
}

const AuthenticatedImage = ({
  url,
  alt,
  className,
  onLoadStatus,
}: {
  url: string;
  alt: string;
  className: string;
  onLoadStatus: (
    status: "loading" | "success" | "error",
    errorMsg?: string,
  ) => void;
}) => {
  const { data: imgSrc, isLoading, error } = useAuthenticatedImage(url);

  React.useEffect(() => {
    if (isLoading) {
      onLoadStatus("loading");
    } else if (imgSrc) {
      onLoadStatus("success");
    } else if (error) {
      onLoadStatus("error", error.message);
    }
  }, [imgSrc, error, isLoading, onLoadStatus]);

  if (isLoading) {
    return (
      <div
        className={cn(className, "animate-pulse bg-primary-100 min-h-[100px]")}
      />
    );
  }

  if (error || !imgSrc) {
    const errorMsg = error?.message || "Failed to load image";
    return (
      <div
        className={cn(
          className,
          "bg-warning-50/50 border border-warning-200 text-warning-800 text-[10px] p-4 text-center flex flex-col items-center justify-center gap-1 font-medium select-none overflow-y-auto w-full h-full",
        )}
      >
        <span className="font-bold text-xs">⚠️ Scan Pending / Error</span>
        <span className="line-clamp-4 leading-snug text-warning-800">
          {errorMsg}
        </span>
      </div>
    );
  }

  return <img src={imgSrc} alt={alt} className={className} />;
};

const getAttachmentMeta = (att: Attachment) => {
  const attAsCustom = att as unknown as {
    attachmentId?: string;
    attachment_id?: string;
    _id?: string;
    fileId?: string;
    path?: string;
  };
  const attId = String(
    att.id ??
      attAsCustom.attachmentId ??
      attAsCustom.attachment_id ??
      attAsCustom._id ??
      attAsCustom.fileId ??
      "",
  );
  const attUrl = att.url || attAsCustom.path;
  return { attId, attUrl };
};

const formatBytes = (bytes?: number) => {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return "";
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

const getFileConfig = (filename: string, contentType?: string) => {
  const extension = filename.split(".").pop()?.toLowerCase() || "";
  const ct = (contentType || "").toLowerCase();

  // Word
  if (
    ct === "application/msword" ||
    ct ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ["doc", "docx"].includes(extension)
  ) {
    return {
      type: "word",
      label: "Document",
      icon: <FaFileWord className="w-4 h-4 text-white" />,
      brandBg: "bg-blue-600",
      accentColor: "text-blue-200 hover:text-blue-400",
      hoverBorder: "hover:border-blue-500",
      cornerSvg: "text-blue-600",
    };
  }

  // PDF
  if (ct === "application/pdf" || extension === "pdf") {
    return {
      type: "pdf",
      label: "PDF",
      icon: <FaRegFilePdf className="w-4 h-4 text-white" />,
      brandBg: "bg-error-600",
      accentColor: "text-error-200 hover:text-error-400",
      hoverBorder: "hover:border-error-500",
      cornerSvg: "text-error-600",
    };
  }

  // Spreadsheet
  if (
    ct === "application/vnd.ms-excel" ||
    ct ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    ["xls", "xlsx", "csv"].includes(extension)
  ) {
    return {
      type: "spreadsheet",
      label: "Spreadsheet",
      icon: <FileSpreadsheet className="w-4 h-4 text-white" />,
      brandBg: "bg-success-600",
      accentColor: "text-success-200 hover:text-success-400",
      hoverBorder: "hover:border-success-500",
      cornerSvg: "text-success-600",
    };
  }

  // Archive
  if (
    ct === "application/zip" ||
    ct === "application/x-rar-compressed" ||
    ["zip", "rar", "7z", "tar", "gz"].includes(extension)
  ) {
    return {
      type: "archive",
      label: "Archive",
      icon: <FileArchive className="w-4 h-4 text-white" />,
      brandBg: "bg-warning-600",
      accentColor: "text-warning-200 hover:text-warning-400",
      hoverBorder: "hover:border-warning-500",
      cornerSvg: "text-warning-600",
    };
  }

  // Video
  if (
    ct.startsWith("video/") ||
    ["mp4", "mov", "avi", "webm"].includes(extension)
  ) {
    return {
      type: "video",
      label: "Video",
      icon: <FileVideo className="w-4 h-4 text-white" />,
      brandBg: "bg-info-600",
      accentColor: "text-info-200 hover:text-info-400",
      hoverBorder: "hover:border-info-500",
      cornerSvg: "text-info-600",
    };
  }

  // Audio
  if (ct.startsWith("audio/") || ["mp3", "wav", "ogg"].includes(extension)) {
    return {
      type: "audio",
      label: "Audio",
      icon: <FileAudio className="w-4 h-4 text-white" />,
      brandBg: "bg-indigo-600",
      accentColor: "text-indigo-200 hover:text-indigo-400",
      hoverBorder: "hover:border-indigo-500",
      cornerSvg: "text-indigo-600",
    };
  }

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
      "go",
      "rs",
      "php",
    ].includes(extension)
  ) {
    return {
      type: "code",
      label: "Code",
      icon: <FileCode className="w-4 h-4 text-white" />,
      brandBg: "bg-purple-600",
      accentColor: "text-purple-200 hover:text-purple-400",
      hoverBorder: "hover:border-purple-500",
      cornerSvg: "text-purple-600",
    };
  }

  // Generic
  return {
    type: "generic",
    label: "File",
    icon: <FileIcon className="w-4 h-4 text-white" />,
    brandBg: "bg-primary-600",
    accentColor: "text-primary-200 hover:text-primary-400",
    hoverBorder: "hover:border-primary-500",
    cornerSvg: "text-primary-600",
  };
};

const renderCardMockup = (
  type: string,
  filename: string,
  contentType?: string,
  size?: number,
) => {
  const name = filename || "file";
  const nameWithoutExt = name.replace(/\.[^.]+$/, "");
  const hash = name
    .split("")
    .reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0);

  if (type === "word") {
    const lineWidths = ["w-full", "w-3/4", "w-5/6", "w-2/3", "w-1/2", "w-4/5"];
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
            <div key={i} className={`${w} h-0.5 bg-slate-200 rounded-[1px]`} />
          ))}
        </div>
      </div>
    );
  }

  if (type === "pdf") {
    const lineWidths = ["w-full", "w-4/5", "w-5/6", "w-3/4", "w-2/3"];
    const titleLine = nameWithoutExt.slice(0, 22);
    const lines = Array.from(
      { length: 5 },
      (_, i) => lineWidths[(hash + i * 2) % lineWidths.length],
    );
    return (
      <div className="flex-1 bg-white p-3 flex flex-col gap-1 overflow-hidden select-none relative">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-error-800 tracking-tight truncate max-w-[120px]">
            {titleLine}
          </span>
          <span className="text-[7px] font-extrabold text-error-600 border border-error-200 px-1 py-0.2 rounded bg-error-50/50">
            PDF
          </span>
        </div>
        <div className="w-full h-1 bg-error-300 rounded-[1px] mt-0.5 mb-1.5 opacity-70" />
        <div className="flex flex-col gap-0.5 flex-1 z-10">
          {lines.map((w, i) => (
            <div key={i} className={`${w} h-0.5 bg-slate-200 rounded-[1px]`} />
          ))}
        </div>
        <div className="absolute right-2 bottom-2 opacity-15">
          <FileText className="w-12 h-12 text-error-600" />
        </div>
      </div>
    );
  }

  if (type === "spreadsheet") {
    return (
      <div className="flex-1 bg-white p-3 flex flex-col gap-1 overflow-hidden select-none">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-success-800 tracking-tight truncate max-w-[120px]">
            {nameWithoutExt.slice(0, 22)}
          </span>
          <span className="text-[7px] font-bold text-success-600">SHEET</span>
        </div>
        <div className="border border-slate-100 rounded flex flex-col mt-1 flex-1 divide-y divide-slate-100">
          <div className="grid grid-cols-4 bg-success-50/50 h-3.5 divide-x divide-slate-100">
            <div className="bg-success-100/30"></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          {Array.from({ length: 4 }).map((_, r) => (
            <div
              key={r}
              className="grid grid-cols-4 h-3 divide-x divide-slate-100"
            >
              <div className="bg-slate-50/50"></div>
              <div className="p-0.5 flex items-center">
                <div className="w-3/4 h-0.5 bg-slate-200" />
              </div>
              <div className="p-0.5 flex items-center">
                <div className="w-1/2 h-0.5 bg-slate-300" />
              </div>
              <div className="p-0.5 flex items-center">
                <div className="w-2/3 h-0.5 bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "archive") {
    return (
      <div className="flex-1 bg-white p-3 flex flex-col gap-1 overflow-hidden select-none">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-warning-800 tracking-tight truncate max-w-[120px]">
            {nameWithoutExt.slice(0, 22)}
          </span>
          <span className="text-[7px] font-bold text-warning-600">ZIP</span>
        </div>
        <div className="w-full h-1 bg-warning-300 rounded-[1px] mt-0.5 mb-1.5 opacity-70" />
        <div className="flex flex-col gap-1.5 mt-0.5 flex-1">
          <div className="flex items-center gap-1 text-[8px] text-slate-500 font-medium">
            <span>📁</span>
            <span className="truncate">content/</span>
          </div>
          <div className="flex items-center gap-1 text-[8px] text-slate-500 font-medium pl-3">
            <span>📄</span>
            <span className="truncate">data.json</span>
          </div>
          <div className="flex items-center gap-1 text-[8px] text-slate-500 font-medium pl-3">
            <span>📄</span>
            <span className="truncate">index.js</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "video") {
    return (
      <div className="flex-1 bg-slate-950 flex flex-col justify-between p-3 overflow-hidden select-none relative group-hover:bg-slate-900 transition-colors duration-300">
        <div className="flex items-center justify-between text-[8px] text-slate-400">
          <span className="truncate max-w-[150px]">{name}</span>
          <span className="text-[7px] font-bold text-info-400">VIDEO</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 group-hover:scale-105 transition-transform duration-300">
            <svg
              className="w-3.5 h-3.5 text-white ml-0.5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="w-full flex items-center gap-1.5 text-[8px] text-slate-400 pt-8">
          <span>0:00</span>
          <div className="flex-1 h-0.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-info-500 rounded-full" />
          </div>
          <span>2:35</span>
        </div>
      </div>
    );
  }

  if (type === "audio") {
    const bars = [20, 45, 60, 30, 80, 50, 75, 40, 90, 65, 35, 70, 45, 25];
    return (
      <div className="flex-1 bg-slate-50 p-3 flex flex-col justify-between overflow-hidden select-none">
        <span className="text-[9px] font-bold text-indigo-800 tracking-tight truncate">
          {nameWithoutExt.slice(0, 22)}
        </span>
        <div className="flex items-end justify-center gap-[2px] h-9 px-2 my-1">
          {bars.map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className="w-[2.5px] bg-indigo-400/80 rounded-full"
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[8px] text-indigo-500 font-medium">
          <span className="flex items-center gap-1">🔊 AUDIO</span>
          <span>03:14</span>
        </div>
      </div>
    );
  }

  if (type === "code") {
    return (
      <div className="flex-1 bg-zinc-950 p-3 flex flex-col gap-1 overflow-hidden select-none font-mono text-[7.5px] leading-tight text-zinc-400">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-0.5">
          <span className="text-zinc-500 truncate max-w-[150px]">{name}</span>
          <span className="text-purple-400 font-bold">CODE</span>
        </div>
        <div className="flex flex-col gap-0.5 mt-1">
          <div className="flex gap-1">
            <span className="text-purple-400">import</span>
            <span className="text-blue-400">React</span>
            <span className="text-purple-400">from</span>
            <span className="text-green-400">'react'</span>;
          </div>
          <div className="flex gap-1 pl-2">
            <span className="text-purple-400">const</span>
            <span className="text-yellow-400">App</span>
            <span>=</span>
            <span>()</span>
            <span className="text-purple-400">=&gt;</span>
            <span>{"{"}</span>
          </div>
          <div className="flex gap-0.5 pl-4">
            <span className="text-purple-400">return</span>
            <span className="text-blue-400">&lt;div&gt;</span>
            <span className="text-slate-300">Hello</span>
            <span className="text-blue-400">&lt;/div&gt;</span>;
          </div>
          <div className="pl-2">{"};"}</div>
        </div>
      </div>
    );
  }

  // Generic
  return (
    <div className="flex-1 bg-white p-3 flex flex-col justify-between overflow-hidden select-none">
      <span className="text-[9px] font-bold text-primary-800 tracking-tight truncate">
        {name}
      </span>
      <div className="flex flex-col items-center justify-center flex-1 my-1">
        <div className="p-2 bg-primary-50 rounded-full border border-primary-100">
          {getAttachmentIcon(contentType, filename)}
        </div>
      </div>
      <div className="flex justify-between items-center text-[7.5px] text-primary-500 font-medium">
        <span className="truncate max-w-[100px]">
          {contentType || "Unknown Type"}
        </span>
        <span>{formatBytes(size)}</span>
      </div>
    </div>
  );
};

export const AttachmentsSection = ({
  attachments,
  mailboxId,
  emailId,
  pendingDownloads,
  handleDownload,
  onPreviewAttachment,
  analysisStatus,
}: AttachmentsSectionProps) => {
  const [imageStates, setImageStates] = React.useState<
    Record<
      string,
      { status: "loading" | "success" | "error"; errorMsg?: string }
    >
  >({});

  if (!attachments || attachments.length === 0) return null;

  const isImageAttachment = (att: Attachment) => {
    if (att.contentType?.startsWith("image/")) return true;
    const ext = att.filename?.split(".").pop()?.toLowerCase();
    return ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext || "");
  };

  const uniqueAttachments = Array.from(
    new Map(
      attachments.map((att) => {
        const { attId } = getAttachmentMeta(att);
        const attFilename = att.filename || attId;
        return [attFilename, att];
      }),
    ).values(),
  );

  const imageAtts = uniqueAttachments.filter(isImageAttachment);
  const fileAtts = uniqueAttachments.filter((att) => !isImageAttachment(att));

  return (
    <div className="mt-6 space-y-6">
      {/* Inline images rendered with AuthenticatedImage component */}
      {imageAtts.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {imageAtts.map((att: Attachment) => {
            const { attId, attUrl } = getAttachmentMeta(att);
            const defaultUrl = `${baseURL}/mailboxes/${mailboxId}/emails/${emailId}/attachments/${attId}/download`;
            const targetUrl = attUrl || defaultUrl;
            const isDownloading = pendingDownloads[attId];
            const state = imageStates[attId] || { status: "loading" };
            const isLoaded = state.status === "success";
            const isError = state.status === "error";
            return (
              <div
                key={attId}
                onClick={() => isLoaded && onPreviewAttachment?.(att)}
                className={cn(
                  "relative w-[280px] h-[180px] rounded-xl overflow-hidden border border-primary-200 shadow-xs",
                  isLoaded
                    ? "group/image cursor-pointer"
                    : isError
                      ? ""
                      : "pointer-events-none",
                )}
              >
                <AuthenticatedImage
                  url={targetUrl}
                  alt={att.filename}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-105"
                  onLoadStatus={(status, errorMsg) => {
                    const currentState = imageStates[attId];
                    if (
                      !currentState ||
                      currentState.status !== status ||
                      currentState.errorMsg !== errorMsg
                    ) {
                      setImageStates((prev) => ({
                        ...prev,
                        [attId]: { status, errorMsg },
                      }));
                    }
                  }}
                />
                {/* Glassmorphic hover overlay */}
                {isLoaded && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-between p-3.5 backdrop-blur-[2px]">
                    <div className="w-full min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {att.filename}
                      </p>
                      <p className="text-[10px] text-zinc-300 mt-0.5 font-medium">
                        {formatBytes(att.size)}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={isDownloading}
                      className="bg-white/95 text-primary-900 hover:bg-white hover:scale-105 transition-all duration-200 font-semibold mb-1.5 cursor-pointer"
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
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Documents & Files Grid */}
      {fileAtts.length > 0 && (
        <div className="space-y-3 pt-2">
          <Text
            size="sm"
            font="bold"
            className="text-primary-700 uppercase tracking-wider"
          >
            Documents & Files
          </Text>
          <div className="flex flex-wrap gap-4">
            {fileAtts.map((att: Attachment) => {
              const { attId, attUrl } = getAttachmentMeta(att);
              const isDownloading = pendingDownloads[attId];
              const config = getFileConfig(att.filename, att.contentType);
              const isPending = analysisStatus === "PENDING";

              return (
                <div
                  key={attId}
                  onClick={() => !isPending && onPreviewAttachment?.(att)}
                  className={cn(
                    "relative w-72 h-44 rounded-xl border border-primary-200 shadow-xs overflow-hidden bg-zinc-50 flex flex-col group transition-all duration-300",
                    isPending
                      ? "border-warning-200"
                      : cn(
                          config.hoverBorder,
                          "cursor-pointer hover:shadow-md hover:scale-[1.01] hover:bg-zinc-100/50",
                        ),
                    isDownloading && "pointer-events-none opacity-80",
                  )}
                >
                  {/* Mock Thumbnail Preview */}
                  {isPending ? (
                    <div className="bg-warning-50/50 border border-warning-200 text-warning-800 text-[10px] p-4 text-center flex flex-col items-center justify-center gap-1 font-medium select-none overflow-y-auto w-full h-full">
                      <Text
                        font="bold"
                        size="xs"
                        color="warning-800"
                        className="mt-1"
                      >
                        ⚠️ Scan Pending / Error
                      </Text>
                      <Text
                        size="xs"
                        color="warning-800"
                        className="mt-0.5 line-clamp-3 leading-snug px-2"
                      >
                        Cannot download attachment while email is still
                        undergoing security analysis
                      </Text>
                    </div>
                  ) : (
                    renderCardMockup(
                      config.type,
                      att.filename,
                      att.contentType,
                      att.size,
                    )
                  )}

                  {/* Bottom Dark Bar */}
                  <div className="h-12 bg-[#121212] flex items-center justify-between px-3 relative">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-7 h-7 rounded flex items-center justify-center text-white shadow-sm select-none shrink-0",
                          config.brandBg,
                        )}
                      >
                        {isDownloading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          config.icon
                        )}
                      </div>
                      <Text className="text-white text-xs font-semibold max-w-[180px] truncate">
                        {att.filename}
                      </Text>
                    </div>

                    {!isPending && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isDownloading) {
                            handleDownload(attId, att.filename, attUrl);
                          }
                        }}
                        className="absolute right-6 top-0 bottom-0 flex items-center transition-opacity cursor-pointer hover:scale-110 z-10"
                      >
                        {isDownloading ? (
                          <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Download
                            className={cn(
                              "w-4 h-4 text-blue-200",
                              config.accentColor,
                            )}
                          />
                        )}
                      </div>
                    )}

                    {!isPending && (
                      <svg
                        className={cn(
                          "absolute bottom-0 right-0 w-5 h-5",
                          config.cornerSvg,
                        )}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <polygon points="24,24 24,0 0,24" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
