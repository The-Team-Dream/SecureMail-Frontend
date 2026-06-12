"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Text } from "@/_components/shared/Text";
import { Badge } from "@/components/ui/badge";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  ShieldCheck,
  Activity,
  AlertCircle,
  Shield,
  Reply,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import type { EmailDetails } from "@/APIs/types/Email";

interface SecurityDeepDiveProps {
  email: EmailDetails;
  setIsAnalysisOpen: (open: boolean) => void;
  setComposeOpen: (open: boolean, config: any) => void;
}

export const SecurityDeepDive = ({
  email,
  setIsAnalysisOpen,
  setComposeOpen,
}: SecurityDeepDiveProps) => {
  if (!email.securityReport) return null;

  return (
    <div className="h-full flex flex-col bg-ghostBlue/5">
      <div className="p-6 border-b border-primary-100 bg-white sticky top-0 z-10">
        <SheetHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary-500 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <Text size="xs" font="black" className="uppercase tracking-[0.2em]">
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
                    364.4 - 364.4 * email.securityReport.confidenceScore,
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
              <Text size="2xl" font="black" className="leading-none">
                {Math.round(email.securityReport.confidenceScore * 100)}%
              </Text>
              <Text size="xs" font="bold" className="opacity-40 uppercase">
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
              <Text size="sm" className="text-purple-700 leading-relaxed">
                {(email.securityReport as any).campaignDescription ||
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
                <Text size="sm" className="text-orange-700 leading-relaxed">
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
          <Text size="sm" color="primary-700" className="leading-relaxed">
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
              <Text size="sm" className="text-white italic leading-relaxed">
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
                      className="w-full flex flex-col p-4 rounded-xl border border-primary-100 bg-white hover:border-primary-300 hover:shadow-xs transition-all duration-300 text-left group"
                    >
                      <Text
                        size="sm"
                        className="text-primary-800 leading-relaxed font-medium line-clamp-3 mb-2"
                      >
                        "{suggestion}"
                      </Text>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-primary-600 group-hover:text-primary-800 transition-colors uppercase tracking-wider">
                        Use Safe Draft <Reply className="w-3 h-3 ml-1" />
                      </div>
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
