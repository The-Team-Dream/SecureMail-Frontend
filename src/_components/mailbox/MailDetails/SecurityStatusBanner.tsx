"use client";

import React, { useState } from "react";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/_components/shared/Text";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SecurityDeepDive } from "./SecurityDeepDive";
import type { EmailDetails } from "@/APIs/types/Email";

interface SecurityStatusBannerProps {
  email: EmailDetails;
  emailId: string;
  setComposeOpen: (open: boolean, config: any) => void;
}

export const SecurityStatusBanner = ({
  email,
  emailId,
  setComposeOpen,
}: SecurityStatusBannerProps) => {
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  if (email.analysisStatus === "PENDING") {
    return (
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
    );
  }

  if (!email.securityReport) return null;

  return (
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
            {email.securityReport.status} Verdict
          </Text>
          <div className="w-1 h-1 rounded-full bg-primary-200" />
          <Text size="xs" font="medium" className="opacity-60">
            {Math.round(email.securityReport.confidenceScore * 100)}% Confidence
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
          <SecurityDeepDive
            email={email}
            setIsAnalysisOpen={setIsAnalysisOpen}
            setComposeOpen={setComposeOpen}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};
