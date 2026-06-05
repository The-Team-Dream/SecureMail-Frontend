"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Reply,
  Forward,
  Shield,
  MailOpen,
  Mail,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Text } from "@/_components/shared/Text";
import { useRouter, useParams } from "next/navigation";
import { ReclassifyMenu } from "./ReclassifyMenu";
import { ActionButton } from "@/_components/shared/ActionButton";
import { cn, getInitials } from "@/lib/utils";
import {
  useEmailDetails,
  useReadEmail,
  useDeleteEmail,
  useScanEmail,
} from "@/APIs/hooks/emails";
import { emailsApi } from "@/APIs/features/emails";
import { useMailStore } from "@/stores/useMailStore";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { baseURL } from "@/lib/axios";
import { MailDetailsSkeleton } from "../skeleton/MailDetailsSkeleton";
import { StateMessage } from "../shared/StateMessage";
import notFoundImg from "../../../public/images/not-found.png";
import { Spinner } from "@/components/ui/spinner";

// Sub-components
import { SecurityStatusBanner } from "./MailDetails/SecurityStatusBanner";
import { AttachmentsSection } from "./MailDetails/AttachmentsSection";
import { SecureRepliesSection } from "./MailDetails/SecureRepliesSection";

export const MailDetails = ({ emailId }: { emailId: string }) => {
  const router = useRouter();
  const params = useParams();
  const mailboxId = params.mailboxId as string;
  const [pendingDownloads, setPendingDownloads] = useState<
    Record<string, boolean>
  >({});

  const { data: email, isLoading, error } = useEmailDetails(mailboxId, emailId);
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

  const handleDownload = async (
    attachmentId: string,
    filename: string,
    url?: string,
  ) => {
    setPendingDownloads((prev) => ({ ...prev, [attachmentId]: true }));
    try {
      await emailsApi.downloadAttachment(
        mailboxId,
        emailId,
        attachmentId,
        filename,
        url,
      );
    } catch (e) {
      console.error(e);
      toast.error("Failed to download attachment");
    } finally {
      setPendingDownloads((prev) => ({ ...prev, [attachmentId]: false }));
    }
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

  const formatBodyDates = (text: string) => {
    return text.replace(
      /Date:\s*(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)/g,
      (match, dateString) => {
        try {
          return `Date: ${format(new Date(dateString), "PPpp")}`;
        } catch (e) {
          return match;
        }
      },
    );
  };

  const handleReply = () => {
    if (!email) return;
    setComposeOpen(true, {
      mode: "reply",
      data: {
        to: email.fromAddr,
        subject: `Re: ${email.subject}`,
        fromName: email.fromName,
        receivedAt: email.receivedAt,
        emailId: String(email.id),
        originalHtml: email.bodyHtml
          ? processHtmlBody(email.bodyHtml)
          : undefined,
        originalText: email.bodyText,
        toAddr: email.toAddr,
      },
    });
  };

  const handleForward = () => {
    if (!email) return;
    setComposeOpen(true, {
      mode: "forward",
      data: {
        subject: `Fwd: ${email.subject}`,
        fromName: email.fromName,
        receivedAt: email.receivedAt,
        emailId: String(email.id),
        originalHtml: email.bodyHtml
          ? processHtmlBody(email.bodyHtml)
          : undefined,
        originalText: email.bodyText,
        toAddr: email.toAddr,
      },
    });
  };

  const processHtmlBody = (html: string) => {
    let processedHtml = formatBodyDates(html);
    const token = Cookies.get("token");

    // Inject auth token or replace cid references for inline images
    if (email?.attachments) {
      email.attachments.forEach((att) => {
        const attId = String(
          att.id ??
            (att as any).attachmentId ??
            (att as any).attachment_id ??
            (att as any)._id ??
            (att as any).fileId ??
            "",
        );
        const attUrl = att.url || (att as any).path;
        const attFilename = att.filename || "";
        const defaultUrl = `${baseURL}/mailboxes/${mailboxId}/emails/${emailId}/attachments/${attId}/download`;
        const authenticatedUrl = attUrl
          ? attUrl
          : token
            ? `${defaultUrl}?token=${token}`
            : defaultUrl;

        // Replace cid:
        if (attId) {
          const cidRegex1 = new RegExp(`cid:${attId}`, "gi");
          processedHtml = processedHtml.replace(cidRegex1, authenticatedUrl);
        }
        if (attFilename) {
          const cidRegex2 = new RegExp(`cid:${attFilename}`, "gi");
          processedHtml = processedHtml.replace(cidRegex2, authenticatedUrl);
        }
      });
    }

    // Also catch any relative download URLs that the backend might have sent
    if (token) {
      const downloadRegex =
        /(src=["'])(\/mailboxes\/\d+\/emails\/\d+\/attachments\/\d+\/download)(["'])/gi;
      processedHtml = processedHtml.replace(
        downloadRegex,
        `$1${baseURL}$2?token=${token}$3`,
      );
    }

    const sanitizedHtml = DOMPurify.sanitize(processedHtml, {
      ADD_ATTR: ["target", "rel"],
    });

    if (typeof window !== "undefined") {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(sanitizedHtml, "text/html");

        // 1. Force target="_blank" and rel="noopener noreferrer" for all links
        doc.querySelectorAll("a").forEach((link) => {
          link.setAttribute("target", "_blank");
          link.setAttribute("rel", "noopener noreferrer");
        });

        // 2. Remove hardcoded element backgrounds and inline style backgrounds
        doc.querySelectorAll("*").forEach((el) => {
          if (el.hasAttribute("bgcolor")) {
            el.removeAttribute("bgcolor");
          }
          if (el.hasAttribute("background")) {
            el.removeAttribute("background");
          }
          // Remove color attributes (e.g. <font color="white">)
          if (el.hasAttribute("color")) {
            el.removeAttribute("color");
          }

          const style = el.getAttribute("style");
          if (style) {
            const cleanedStyle = style
              // Remove all background / background-color inline styles
              .replace(/(?<![\w-])background-color\s*:[^;]+;?/gi, "")
              .replace(/(?<![\w-])background\s*:[^;]+;?/gi, "")
              // Remove ALL inline color declarations (dark AND light — both break in opposite themes)
              .replace(/(?<![\w-])color\s*:[^;]+;?/gi, "");
            if (cleanedStyle.trim() === "") {
              el.removeAttribute("style");
            } else {
              el.setAttribute("style", cleanedStyle);
            }
          }
        });

        return doc.body.innerHTML || doc.documentElement.innerHTML;
      } catch (err) {
        console.error("Error post-processing email HTML body:", err);
      }
    }

    return sanitizedHtml;
  };

  return (
    <div className="flex flex-col h-full bg-background p-4 sm:p-8 duration-300">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<ArrowLeft className="w-4 h-4" />}
            label="Back"
            onClick={() => router.back()}
            className="shrink-0"
          />
          <Text size="2xl" font="semiBold">
            {email.subject}
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleScan}
            variant={"outline"}
            disabled={scanMutation.isPending || email.isRescanning}
          >
            {scanMutation.isPending ? (
              <Spinner />
            ) : (
              <Shield className="w-4 h-4" />
            )}
            <span className="hidden sm:flex">Scan</span>
          </Button>
          <ReclassifyMenu emailId={emailId} />
        </div>
      </div>

      {/* Security Status Banner */}
      <SecurityStatusBanner
        email={email}
        emailId={emailId}
        setComposeOpen={setComposeOpen}
      />

      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
            <Text
              size="lg"
              font="bold"
              color={"primary-600"}
              className="uppercase"
            >
              {getInitials(email.fromName || email.fromAddr)}
            </Text>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Text size="sm" font={"medium"}>
                {email.fromAddr}
              </Text>
            </div>
            <Text size="sm" color="primary-500">
              {activeFolder === "sent"
                ? `to: ${Array.isArray(email.toAddr) ? email.toAddr.join(", ") : (email.toAddr as any)}`
                : "to me"}{" "}
              •{" "}
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
        </div>
      </div>

      <div className="flex-1 border-l-2 border-primary-100 pl-6 ml-6 ">
        <div className="text-primary-800 space-y-6 text-[15px] leading-relaxed">
          {email.bodyHtml ? (
            <div
              dangerouslySetInnerHTML={{
                __html: processHtmlBody(email.bodyHtml),
              }}
            />
          ) : (
            <div className="whitespace-pre-wrap">
              {formatBodyDates(email.bodyText || "")}
            </div>
          )}

          {/* Attachments Section */}
          <AttachmentsSection
            attachments={email.attachments}
            mailboxId={mailboxId}
            emailId={emailId}
            pendingDownloads={pendingDownloads}
            handleDownload={handleDownload}
          />

          {/* Zero-Trust Secure Replies Section */}
          <SecureRepliesSection
            suggestedActions={email.securityReport?.suggestedActions || []}
            email={email}
            setComposeOpen={setComposeOpen}
          />
        </div>
      </div>
    </div>
  );
};
