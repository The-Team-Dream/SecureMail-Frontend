"use client";

import React from "react";
import { Sparkles, Reply } from "lucide-react";
import { Text } from "@/_components/shared/Text";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { EmailDetails } from "@/APIs/types/Email";

interface SecureRepliesSectionProps {
  suggestedActions: string[];
  email: EmailDetails;
  setComposeOpen: (open: boolean, config: any) => void;
}

export const SecureRepliesSection = ({
  suggestedActions,
  email,
  setComposeOpen,
}: SecureRepliesSectionProps) => {
  if (!suggestedActions || suggestedActions.length === 0) return null;

  return (
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
        Click any suggested reply below to draft a secure, zero-trust response
        instantly.
      </Text>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {suggestedActions.map((suggestion: string, idx: number) => (
          <button
            key={idx}
            onClick={() => {
              setComposeOpen(true, {
                mode: "reply",
                data: {
                  to: email.fromAddr,
                  subject: `Re: ${email.subject}`,
                  fromName: email.fromName,
                  fromAddr: email.fromAddr,
                  receivedAt: email.receivedAt,
                  emailId: String(email.id),
                  toAddr: email.toAddr,
                  originalHtml: email.bodyHtml,
                  originalText: email.bodyText,
                  attachments: email.attachments,
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
        ))}
      </div>
    </div>
  );
};
