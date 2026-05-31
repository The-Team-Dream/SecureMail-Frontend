"use client";
import {
  ArrowLeft,
  Download,
  Reply,
  Forward,
  ShieldAlert,
  ShieldCheck,
  Shield,
  MailOpen,
  Mail,
  AlertCircle,
  Activity,
  ChevronRight,
  Trash2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/_components/shared/Text";
import { useRouter, useParams } from "next/navigation";
import { ReclassifyMenu } from "./ReclassifyMenu";
import { ActionButton } from "@/_components/shared/ActionButton";
import { cn, getInitials } from "@/lib/utils";
import {
  useEmailDetails,
  useReportEmail,
  useReadEmail,
  useDeleteEmail,
  useScanEmail,
} from "@/APIs/hooks/emails";
import { emailsApi } from "@/APIs/features/emails";
import { RISK_STYLE_MAP, RiskLevel } from "@/constants/security";
import { useMailStore } from "@/stores/useMailStore";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { baseURL } from "@/lib/axios";
import { MailDetailsSkeleton } from "../skeleton/MailDetailsSkeleton";
import { StateMessage } from "../shared/StateMessage";
import { Icons } from "@/constants/icons";
import notFoundImg from "../../../public/images/not-found.png";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthenticatedImage } from "@/APIs/hooks/emails/useAuthenticatedImage";

// Helper component to securely fetch and display an image attachment using react-query and Blob
const AuthenticatedImage = ({ url, alt, className }: { url: string; alt: string; className: string }) => {
  const { data: imgSrc, isLoading } = useAuthenticatedImage(url);

  if (isLoading || !imgSrc) {
    return <div className={cn(className, "animate-pulse bg-primary-100 min-h-[100px]")} />;
  }

  return <img src={imgSrc} alt={alt} className={className} />;
};

export const MailDetails = ({ emailId }: { emailId: string }) => {
  const router = useRouter();
  const params = useParams();
  const mailboxId = params.mailboxId as string;
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  const { data: email, isLoading, error } = useEmailDetails(mailboxId, emailId);
  const reportMutation = useReportEmail(mailboxId);
  const readMutation = useReadEmail(mailboxId);
  const activeFolder = useMailStore((s) => s.activeFolder);
  const deleteMutation = useDeleteEmail(mailboxId, activeFolder ?? undefined);
  const scanMutation = useScanEmail(mailboxId);
  const setComposeOpen = useMailStore((s) => s.setComposeOpen);

  if (isLoading) {
    return <MailDetailsSkeleton />;
  }

  if (error || !email) {
    return (
      <StateMessage
        title="Error"
        variant="error"
        description="Failed to load email details."
        image={notFoundImg}
      />
    );
  }

  const handleDownload = (attachmentId: string, filename: string) => {
    emailsApi.downloadAttachment(mailboxId, emailId, attachmentId, filename);
  };

  const handleReportSpam = async () => {
    await reportMutation.mutateAsync({ id: emailId, type: "spam" });
    router.push(`/mailboxes/${mailboxId}/spam`);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(emailId);
    router.push(`/mailboxes/${mailboxId}/${activeFolder ?? "inbox"}`);
  };

  const handleToggleRead = () => {
    readMutation.mutate({ id: emailId, read: !email?.isRead });
  };

  const handleScan = () => {
    scanMutation.mutate(emailId);
  };

  const handleReply = () => {
    if (!email) return;
    setComposeOpen(true, {
      mode: "reply",
      data: {
        to: email.fromAddr,
        subject: email.subject,
        fromName: email.fromName,
        receivedAt: email.receivedAt,
        emailId: String(email.id),
        bodyHtml: email.bodyHtml,
      },
    });
  };

  const handleForward = () => {
    if (!email) return;
    setComposeOpen(true, {
      mode: "forward",
      data: {
        subject: email.subject,
        fromName: email.fromName,
        receivedAt: email.receivedAt,
        emailId: String(email.id),
        originalHtml: email.bodyHtml,
        originalText: email.bodyText,
      },
    });
  };

  const formatBodyDates = (text: string) => {
    return text.replace(
      /Date:\s*(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)/g,
      (match, dateString) => {
        try {
          return `Date: ${format(new Date(dateString), "PPpp")}`;
        } catch (e) {
          return match;
        }
      }
    );
  };

  const processHtmlBody = (html: string) => {
    let processedHtml = formatBodyDates(html);
    const token = Cookies.get("token");
    
    // Inject auth token or replace cid references for inline images
    if (email?.attachments) {
      email.attachments.forEach(att => {
        const defaultUrl = `${baseURL}/mailboxes/${mailboxId}/emails/${emailId}/attachments/${att.id}/download`;
        const authenticatedUrl = att.url ? att.url : (token ? `${defaultUrl}?token=${token}` : defaultUrl);
        
        // Replace cid:
        const cidRegex1 = new RegExp(`cid:${att.id}`, 'gi');
        const cidRegex2 = new RegExp(`cid:${att.filename}`, 'gi');
        processedHtml = processedHtml.replace(cidRegex1, authenticatedUrl).replace(cidRegex2, authenticatedUrl);
      });
    }

    // Also catch any relative download URLs that the backend might have sent
    if (token) {
      const downloadRegex = /(src=["'])(\/mailboxes\/\d+\/emails\/\d+\/attachments\/\d+\/download)(["'])/gi;
      processedHtml = processedHtml.replace(downloadRegex, `$1${baseURL}$2?token=${token}$3`);
    }

    return DOMPurify.sanitize(processedHtml);
  };

  return (
    <div className="flex flex-col h-full bg-background p-4 sm:p-8 duration-300">
      <div className="mb-6 flex items-center gap-4">
        <Text size="2xl" font="semiBold">
          {email.subject}
        </Text>
      </div>

      {/* Security Status Banner */}
      {email.analysisStatus === "PENDING" ? (
        <div className="mb-6 p-4 rounded-xl border flex items-center justify-between bg-primary-50/50 border-primary-100 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-100/50">
              <ShieldCheck className="w-5 h-5 text-primary-600 animate-spin" />
            </div>
            <div className="flex flex-col">
              <Text size="sm" font="bold" className="text-primary-700">
                Scanning... Please wait.
              </Text>
            </div>
          </div>
        </div>
      ) : (
        email.securityReport && (
          <div
            className={cn(
              "mb-6 p-2 pl-4 rounded-xl border flex items-center justify-between transition-all duration-500",
              email.securityReport.status === "SAFE"
                ? "bg-success-50/50 border-success-100"
                : email.securityReport.status === "MALICIOUS"
                  ? "bg-error-50/50 border-error-100"
                  : "bg-warning-50/50 border-warning-100",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-1.5 rounded-lg",
                  email.securityReport.status === "SAFE"
                    ? "bg-success-100/50"
                    : "bg-primary-100/50",
                )}
              >
                <ShieldCheck
                  className={cn(
                    "w-4 h-4",
                    email.securityReport.status === "SAFE"
                      ? "text-success-600"
                      : "text-primary-600",
                  )}
                />
              </div>
              <div className="flex items-center gap-2">
                <Text
                  size="sm"
                  font="bold"
                  className={cn(
                    email.securityReport.status === "SAFE"
                      ? "text-success-700"
                      : "text-primary-700",
                  )}
                >
                  {email.securityReport.status} Analysis
                </Text>
                <div className="w-1 h-1 rounded-full bg-primary-200" />
                <Text size="xs" font="medium" className="opacity-60">
                  {Math.round(email.securityReport.confidenceScore * 100)}%
                  Confidence
                </Text>
                {email.isRescanning && (
                  <Badge
                    variant="outline"
                    className="ml-2 bg-primary-50 text-primary-700 border-primary-200 animate-pulse text-[10px] px-2 py-0.5 font-bold"
                  >
                    AI Rescanning...
                  </Badge>
                )}
              </div>
            </div>

            <Sheet open={isAnalysisOpen} onOpenChange={setIsAnalysisOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-xs font-bold uppercase tracking-tight text-primary-600 hover:bg-white/50"
                >
                  Full Analysis <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md w-full p-0 border-l border-primary-100 overflow-y-auto">
                <div className="h-full flex flex-col bg-ghostBlue/5">
                  <div className="p-6 border-b border-primary-100 bg-white sticky top-0 z-10">
                    <SheetHeader className="space-y-1">
                      <div className="flex items-center gap-2 text-primary-500 mb-2">
                        <ShieldCheck className="w-5 h-5" />
                        <Text
                          size="xs"
                          font="black"
                          className="uppercase tracking-[0.2em]"
                        >
                          SecureMail AI-Guard
                        </Text>
                      </div>
                      <SheetTitle className="text-2xl font-bold text-primary-950">
                        Security Deep-Dive
                      </SheetTitle>
                    </SheetHeader>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Risk Score Circle */}
                    <div className="flex flex-col items-center p-8 rounded-4xl bg-white border border-primary-100 shadow-xs relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary-500 via-secondary-500 to-primary-500" />
                      <div className="relative w-32 h-32 mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-primary-50"
                          />
                          <motion.circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={364.4}
                            initial={{ strokeDashoffset: 364.4 }}
                            animate={{
                              strokeDashoffset:
                                364.4 -
                                364.4 * email.securityReport.confidenceScore,
                            }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                            className={cn(
                              email.securityReport.confidenceScore < 0.4
                                ? "text-error-500"
                                : email.securityReport.confidenceScore < 0.7
                                  ? "text-warning-500"
                                  : "text-success-500",
                            )}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Text
                            size="2xl"
                            font="black"
                            className="leading-none"
                          >
                            {Math.round(
                              email.securityReport.confidenceScore * 100,
                            )}
                            %
                          </Text>
                          <Text
                            size="xs"
                            font="bold"
                            className="opacity-40 uppercase"
                          >
                            Confidence
                          </Text>
                        </div>
                      </div>
                      <Text
                        font="bold"
                        size="lg"
                        className={cn(
                          email.securityReport.status === "SAFE"
                            ? "text-success-600"
                            : "text-error-600",
                        )}
                      >
                        {email.securityReport.status} Verdict
                      </Text>
                    </div>

                    {/* Analysis Summary */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-primary-500 rounded-full" />
                        <Text
                          font="bold"
                          size="sm"
                          className="uppercase tracking-wide text-primary-900"
                        >
                          Analysis Summary
                        </Text>
                      </div>
                      <div className="p-5 rounded-2xl bg-white border border-primary-100 leading-relaxed text-sm text-primary-700">
                        {email.securityReport.description ||
                          email.securityReport.detectionMessage}
                      </div>
                    </div>

                    {/* Insights Grid */}
                    <div className="grid grid-cols-1 gap-4">
                      {(email.securityReport as any).isCampaign && (
                        <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100">
                          <div className="flex items-center gap-2 mb-3">
                            <Mail className="w-4 h-4 text-purple-600" />
                            <Text
                              size="xs"
                              font="black"
                              className="text-purple-700 uppercase tracking-widest"
                            >
                              Campaign Detected
                            </Text>
                          </div>
                          <Text
                            size="sm"
                            className="text-purple-700 leading-relaxed"
                          >
                            {(email.securityReport as any)
                              .campaignDescription ||
                              "Coordinated threat campaign identified."}
                          </Text>
                        </div>
                      )}

                      {email.securityReport.anomalies &&
                        email.securityReport.anomalies.length > 0 && (
                          <div className="p-5 rounded-2xl bg-orange-50 border border-orange-100">
                            <div className="flex items-center gap-2 mb-3">
                              <Activity className="w-4 h-4 text-orange-600" />
                              <Text
                                size="xs"
                                font="black"
                                className="text-orange-700 uppercase tracking-widest"
                              >
                                Behavioral Anomaly
                              </Text>
                            </div>
                            <Text
                              size="sm"
                              className="text-orange-700 leading-relaxed"
                            >
                              {email.securityReport.anomalies[0].description}
                            </Text>
                          </div>
                        )}
                    </div>

                    {/* Priority Insight */}
                    <div className="p-5 rounded-2xl bg-primary-100/30 border border-primary-100 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-primary-600" />
                          <Text
                            size="xs"
                            font="black"
                            className="text-primary-700 uppercase tracking-widest"
                          >
                            Priority Reasoning
                          </Text>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-white border-primary-200 text-primary-600 font-bold px-2 py-0"
                        >
                          {email.securityReport.priority}
                        </Badge>
                      </div>
                      <Text
                        size="sm"
                        color="primary-700"
                        className="leading-relaxed"
                      >
                        {email.securityReport.reason}
                      </Text>
                    </div>

                    {/* Recommendation */}
                    {email.securityReport.recommendationText && (
                      <div className="p-5 rounded-2xl bg-primary-900 shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mb-8 blur-2xl" />
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-4 h-4 text-primary-300" />
                            <Text
                              size="xs"
                              font="black"
                              className="text-primary-300 uppercase tracking-widest"
                            >
                              AI Recommendation
                            </Text>
                          </div>
                          <Text
                            size="sm"
                            className="text-white italic leading-relaxed"
                          >
                            "{email.securityReport.recommendationText}"
                          </Text>
                        </div>
                      </div>
                    )}

                    {/* Suggested Replies inside Sheet */}
                    {email.securityReport.suggestedActions &&
                      email.securityReport.suggestedActions.length > 0 && (
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-primary-500 rounded-full" />
                            <Text
                              font="bold"
                              size="sm"
                              className="uppercase tracking-wide text-primary-900"
                            >
                              Zero-Trust Secure Replies
                            </Text>
                          </div>
                          <div className="space-y-3">
                            {email.securityReport.suggestedActions.map(
                              (suggestion: string, idx: number) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setIsAnalysisOpen(false);
                                    setComposeOpen(true, {
                                      mode: "reply",
                                      data: {
                                        to: email.fromAddr,
                                        subject: email.subject,
                                        fromName: email.fromName,
                                        receivedAt: email.receivedAt,
                                        emailId: String(email.id),
                                        bodyHtml: email.bodyHtml,
                                        body: suggestion,
                                      },
                                    });
                                    toast.success("Safe reply draft loaded!");
                                  }}
                                  className="w-full flex flex-col p-4 rounded-xl border border-primary-100 bg-white hover:border-primary-300 hover:shadow-xs transition-all duration-300 text-left group"
                                >
                                  <Text
                                    size="sm"
                                    className="text-primary-800 leading-relaxed font-medium line-clamp-3 mb-2"
                                  >
                                    "{suggestion}"
                                  </Text>
                                  <div className="flex items-center gap-1 text-[10px] font-bold text-primary-600 group-hover:text-primary-800 transition-colors uppercase tracking-wider">
                                    Use Safe Draft{" "}
                                    <Reply className="w-3 h-3 ml-1" />
                                  </div>
                                </button>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )
      )}

      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
            <Text
              size="lg"
              font="bold"
              color={"primary-600"}
              className="uppercase"
            >
              {getInitials(email.fromName)}
            </Text>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Text size="sm" font={"medium"}>
                {email.fromAddr}
              </Text>
            </div>
            <Text size="sm" color="primary-500">
              {activeFolder === "sent" ? `to: ${email.toAddr}` : "to me"} •{" "}
              <span className="text-primary-900">
                {new Date(email.receivedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </Text>
          </div>
        </div>
        {/* Action Buttons  */}
        <div className="flex items-center gap-1.5">
          <ActionButton
            icon={<Reply className="size-4 text-primary" />}
            label="Reply"
            onClick={handleReply}
          />
          <ActionButton
            icon={<Forward className="size-4 text-primary" />}
            label="Forward"
            onClick={handleForward}
          />
          <ActionButton
            icon={
              <ShieldCheck
                className={cn(
                  "size-4 text-primary",
                  (scanMutation.isPending || email.isRescanning) &&
                    "animate-spin",
                )}
              />
            }
            label={
              scanMutation.isPending
                ? "Scanning..."
                : email.isRescanning
                  ? "Rescanning..."
                  : "Scan"
            }
            onClick={handleScan}
            disabled={scanMutation.isPending || email.isRescanning}
          />
          <ActionButton
            icon={
              email.isRead ? (
               <Mail className="size-4 text-primary" />
              ) : (
                <MailOpen className="size-4 text-primary" />
              )
            }
            label={email.isRead ? "Mark as Unread" : "Mark as Read"}
            onClick={handleToggleRead}
            className={email.isRead ? "text-primary-400" : ""}
          />
          <ActionButton
            icon={<Trash2 className="size-4 text-primary" />}
            label="Delete"
            onClick={handleDelete}
            variant="danger"
          />
          <ActionButton
            icon={<ShieldAlert className="size-4 text-primary" />}
            label="Spam"
            onClick={handleReportSpam}
            variant="danger"
          />
        </div>
      </div>

      <div className="flex-1 border-l-2 border-primary-100 pl-6 ml-6 overflow-y-auto">
        <div className="text-primary-800 space-y-6 text-[15px] leading-relaxed">
          {email.bodyHtml ? (
            <div
              dangerouslySetInnerHTML={{
                __html: processHtmlBody(email.bodyHtml),
              }}
            />
          ) : (
            <div className="whitespace-pre-wrap">{formatBodyDates(email.bodyText || "")}</div>
          )}

          {/* Attachments Section */}
          {email.attachments &&
            email.attachments.length > 0 &&
            (() => {
              const isImageAttachment = (att: any) => {
                if (att.contentType?.startsWith("image/")) return true;
                const ext = att.filename?.split(".").pop()?.toLowerCase();
                return ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext || "");
              };

              const imageAtts = email.attachments.filter(isImageAttachment);
              const fileAtts = email.attachments.filter((att: any) => !isImageAttachment(att));

              return (
                <div className="mt-6 space-y-4">
                  {/* Inline images rendered with AuthenticatedImage component */}
                  {imageAtts.length > 0 && (
                    <div className="flex flex-wrap gap-4">
                      {imageAtts.map((att: any) => {
                        const defaultUrl = `${baseURL}/mailboxes/${mailboxId}/emails/${emailId}/attachments/${att.id}/download`;
                        const targetUrl = att.url || defaultUrl;
                        return (
                          <div key={att.id} className="flex flex-col gap-1">
                            <AuthenticatedImage
                              url={targetUrl}
                              alt={att.filename}
                              className="max-w-[500px] max-h-[400px] w-auto h-auto rounded-xl object-contain border border-primary-100 shadow-sm"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {/* Non-image file chips */}
                  {fileAtts.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {fileAtts.map((att: any) => (
                        <div
                          key={att.id}
                          className="flex items-center gap-2 border border-primary-200 px-3 py-1.5 rounded-lg bg-primary-50"
                        >
                          <Text size="sm" className="max-w-[180px] truncate">
                            {att.filename}
                          </Text>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => handleDownload(att.id, att.filename)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

          {/* Zero-Trust Secure Replies Section */}
          {email.securityReport?.suggestedActions &&
            email.securityReport.suggestedActions.length > 0 && (
              <div className="mt-12 p-6 rounded-2xl bg-linear-to-br from-primary-50/20 to-primary-100/10 border border-primary-100/60 space-y-4">
                <div className="flex items-center gap-2 text-primary-800">
                  <Sparkles className="w-5 h-5 text-primary-600 animate-pulse" />
                  <Text font="bold" size="lg">
                    Zero-Trust Secure Replies
                  </Text>
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-primary-100/50 text-primary-700 font-bold px-2 py-0.5"
                  >
                    AI Suggested
                  </Badge>
                </div>
                <Text size="xs" className="text-primary-600/80 -mt-1 block">
                  Click any suggested reply below to draft a secure, zero-trust
                  response instantly.
                </Text>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {email.securityReport.suggestedActions.map(
                    (suggestion: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setComposeOpen(true, {
                            mode: "reply",
                            data: {
                              to: email.fromAddr,
                              subject: email.subject,
                              fromName: email.fromName,
                              receivedAt: email.receivedAt,
                              emailId: String(email.id),
                              bodyHtml: email.bodyHtml,
                              body: suggestion,
                            },
                          });
                          toast.success("Safe reply draft loaded!");
                        }}
                        className="flex flex-col justify-between p-4 rounded-xl border border-primary-100 bg-white hover:border-primary-300 hover:shadow-xs transition-all duration-300 text-left group"
                      >
                        <Text
                          size="sm"
                          className="text-primary-800 leading-relaxed font-medium line-clamp-3 mb-3"
                        >
                          "{suggestion}"
                        </Text>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-primary-600 group-hover:text-primary-800 transition-colors mt-auto uppercase tracking-wider">
                          Use Safe Draft{" "}
                          <Reply className="w-3.5 h-3.5 ml-1 transition-transform group-hover:-translate-x-1" />
                        </div>
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 left-0 right-0 bg-background py-4 px-4 sm:px-8 mt-auto w-full flex items-center justify-between z-10 border-t border-primary-50">
        <Button
          variant="outline"
          size="sm"
          className="h-10 sm:h-11 font-medium border border-primary-100 text-primary-800 shrink-0"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <ReclassifyMenu emailId={emailId} />
      </div>
    </div>
  );
};
