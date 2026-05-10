"use client";
import {
  ArrowLeft,
  Download,
  Reply,
  Forward,
  ShieldAlert,
  MailOpen,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/_components/shared/Text";
import { useRouter, useParams } from "next/navigation";
import { ReclassifyMenu } from "./ReclassifyMenu";
import { ActionButton } from "@/_components/shared/ActionButton";
import { cn, getInitials } from "@/lib/utils";
import { useEmailDetails, useReportEmail, useReadEmail } from "@/APIs/hooks/emails";
import { emailsApi } from "@/APIs/features/emails";
import { RISK_STYLE_MAP, RiskLevel } from "@/constants/security";
import { useMailStore } from "@/stores/useMailStore";
import DOMPurify from "dompurify";
import { MailDetailsSkeleton } from "../skeleton/MailDetailsSkeleton";

export const MailDetails = ({ emailId }: { emailId: string }) => {
  const router = useRouter();
  const params = useParams();
  const mailboxId = params.mailboxId as string;

  const { data: email, isLoading, error } = useEmailDetails(mailboxId, emailId);
  const reportMutation = useReportEmail(mailboxId);
  const readMutation = useReadEmail(mailboxId);
  const setComposeOpen = useMailStore((s) => s.setComposeOpen);
  const activeFolder = useMailStore((s) => s.activeFolder);
  
  if (isLoading) {
    return <MailDetailsSkeleton />;
  }

  if (error || !email) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Text color="error-500">Failed to load email details.</Text>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const handleDownload = (attachmentId: string) => {
    emailsApi.downloadAttachment(mailboxId, emailId, attachmentId);
  };

  const handleReportSpam = async () => {
    await reportMutation.mutateAsync({ id: emailId, type: "spam" });
    router.push(`/mailboxes/${mailboxId}/spam`);
  };

  const handleToggleRead = () => {
    readMutation.mutate({ id: emailId, read: !email?.isRead });
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
        to: email.fromAddr,
        subject: email.subject,
        fromName: email.fromName,
        receivedAt: email.receivedAt,
        emailId: String(email.id),
        bodyHtml: email.bodyHtml,
      },
    });
  };

  return (
    <div className="flex flex-col h-full bg-background p-4 sm:p-8 duration-300">
      <div className="mb-6 flex items-center gap-4">
        <Text size="2xl" font="semiBold">
          {email.subject}.
        </Text>
      </div>

      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
            <Text
              size="lg"
              font="bold"
              color={"primary-600"}
              className="uppercase"
            >
              {getInitials(
                email.fromName ||
                  (email.fromAddr ? email.fromAddr.split("@")[0] : "?"),
              )}
            </Text>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Text font="medium">
                {email.fromName ||
                  (email.fromAddr ? email.fromAddr.split("@")[0] : "Unknown")}
              </Text>
              <Text size="sm" color="primary-500">
                {email.fromAddr}
              </Text>
            </div>
            <Text size="sm" color="primary-500">
              {activeFolder === "sent"
                ? `to: ${email.toAddr && email.toAddr.length > 0 ? email.toAddr.join(", ") : "Unknown Recipient"}`
                : "to me"}{" "}
              • {new Date(email.receivedAt).toLocaleString()}
            </Text>
          </div>
        </div>

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
                __html: DOMPurify.sanitize(email.bodyHtml),
              }}
            />
          ) : (
            <div className="whitespace-pre-wrap">{email.bodyText}</div>
          )}

          {/* Attachments Section */}
          {email.attachments && email.attachments.length > 0 && (
            <div className="mt-8 pt-6 border-t border-primary-100">
              <Text font="semiBold" className="mb-4">
                Attachments
              </Text>
              <div className="flex flex-wrap gap-3">
                {email.attachments.map((att: any) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-2 border border-primary-200 p-2 rounded-lg bg-primary-50"
                  >
                    <Text size="sm" className="max-w-[150px] truncate">
                      {att.filename}
                    </Text>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => handleDownload(att.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Report Section (Basic display) */}
          {email.securityReport && (
            <div className="mt-8 p-4 rounded-lg bg-primary-50 border border-primary-100">
              <div className="flex items-center justify-between mb-4">
                <Text font="semiBold">Security Analysis</Text>
                {email.isPhishing &&
                  (() => {
                    const riskLevel = "High";
                    return (
                      <div
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1 rounded-full",
                          RISK_STYLE_MAP[riskLevel as RiskLevel],
                        )}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {riskLevel} Risk
                        </span>
                      </div>
                    );
                  })()}
              </div>
              <Text size="sm" className="mb-2">
                Verdict:{" "}
                {email.malwareVerdict ||
                  (email.isPhishing ? "Phishing" : "Suspicious")}
              </Text>
              {email.securityReport?.aiAnalysis && (
                <Text size="sm" color="primary-600">
                  {email.securityReport.aiAnalysis}
                </Text>
              )}
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
