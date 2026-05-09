"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Shield,
  BrainCircuit,
  Calendar,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/_components/shared/Text";
import { cn } from "@/lib/utils";
import { SecurityReport } from "@/APIs/types/Reports";
import { Icons } from "@/constants/icons";

interface ReportCardProps {
  report: SecurityReport;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ReportCard({ report, isExpanded, onToggle }: ReportCardProps) {
  const classification = report.classification.toLowerCase();

  const theme: Record<string, any> = {
    phishing: {
      bg: "bg-error-100",
      text: "text-error-700",
      border: "border-error-100",
      accent: "bg-error-600",
      light: "bg-error-50/50",
    },
    spam: {
      bg: "bg-warning-100",
      text: "text-warning-700",
      border: "border-warning-100",
      accent: "bg-warning-600",
      light: "bg-warning-50/50",
    },
    malware: {
      bg: "bg-error-50",
      text: "text-error-700",
      border: "border-error-100",
      accent: "bg-error-500",
      light: "bg-error-50/50",
    },
    clean: {
      bg: "bg-success-50",
      text: "text-success-700",
      border: "border-success-100",
      accent: "bg-success-500",
      light: "bg-success-50/50",
    },
  }[classification as keyof typeof theme] || {
    bg: "bg-primary-50",
    text: "text-primary-700",
    border: "border-primary-100",
    accent: "bg-primary-500",
    light: "bg-primary-50/50",
  };

  const iconMap: Record<string, React.ElementType> = {
    phishing: Icons.Phishing,
    spam: Icons.Spam,
    malware: Icons.Malware,
    clean: Icons.Inbox,
  };

  const BackgroundIcon = iconMap[classification] || Icons.Reports;

  return (
    <div
      className={cn(
        "relative border rounded-2xl bg-background transition-all duration-300 overflow-hidden group",
        isExpanded
          ? "ring-1 ring-primary-200 shadow-xl border-primary-200"
          : "hover:border-primary-200 shadow-sm hover:shadow-md",
      )}
    >
      {/* Background Icon Decor */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none">
        <BackgroundIcon size={120} />
      </div>

      {/* Main Header Content */}
      <div className="p-5 cursor-pointer relative z-10" onClick={onToggle}>
        <div className="flex items-center gap-5">
          {/* Risk Score Circle */}
          <div className="relative shrink-0">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-primary"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={150}
                strokeDashoffset={
                  150 - (150 * report.classificationScore) / 100
                }
                strokeLinecap="round"
                className={cn(
                  "transition-all duration-1000",
                  theme.text.replace("text-", "text-"),
                )}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Text font="bold" size="xs" className={theme.text}>
                {report.classificationScore}%
              </Text>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <Badge
                className={cn(
                  "rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest border-none",
                  theme.accent,
                  "text-background shadow-sm",
                )}
              >
                {report.classification}
              </Badge>
              <div className="flex items-center gap-1.5 opacity-40">
                <Calendar size={12} />
                <Text size="xs" font="medium">
                  {new Date(report.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Text font="semiBold">{report.subject}</Text>
            </div>
            <div className="flex items-center gap-1.5 mt-1 opacity-50">
              <Icons.Mail className="w-4 h-4 text-primary" />
              <Text size="xs">{report.from}</Text>
            </div>
          </div>

          {/* Expand Arrow */}
          <div
            className={cn(
              "flex items-center justify-center transition-all duration-300",
              isExpanded
                ? "text-primary-600"
                : "text-primary-400 group-hover:text-primary-500",
            )}
          >
            <ChevronDown
              size={20}
              className={cn(
                "transition-transform duration-300",
                isExpanded && "rotate-180",
              )}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 pt-2 bg-ghostBlue/30 border-t border-primary-50">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Main Analysis Column */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="bg-background rounded-2xl p-5 shadow-sm border border-primary-50/50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
                        <Shield size={16} />
                      </div>
                      <Text size="sm" font="bold">
                        THREAT ANALYSIS
                      </Text>
                    </div>
                    <Text size="sm" color={"primary-800"} font={"medium"}>
                      {report.classificationReason}
                    </Text>

                    {report.malwareVerdict && (
                      <div className="mt-5 p-4 rounded-xl bg-error-50/50 border border-error-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icons.Malware className="w-4 h-4 text-error-600" />
                            <Text
                              size="xs"
                              font="bold"
                              className="text-error-700 uppercase tracking-wider"
                            >
                              Malware Detected
                            </Text>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-backgound border-error-200 text-error-700 font-bold"
                          >
                            {report.malwareSeverity}
                          </Badge>
                        </div>
                        <Text
                          size="sm"
                          font="semiBold"
                          className="text-error-800 mb-3 block"
                        >
                          {report.malwareVerdict}
                        </Text>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center px-0.5">
                            <Text
                              size="xs"
                              font="bold"
                              className="text-error-600 opacity-70 uppercase tracking-tighter"
                            >
                              Confidence
                            </Text>
                            <Text size="xs" font="bold" color={"error-600"}>
                              {report.malwareScore}%
                            </Text>
                          </div>
                          <div className="w-full h-2 bg-error-100/50 rounded-full overflow-hidden border border-error-100">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${report.malwareScore}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className="h-full bg-linear-to-r from-error-400 to-error-600"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI & Meta Column */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="rounded-2xl p-5 shadow-lg text-background">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 rounded-lg bg-primary-50 text-primary">
                        <BrainCircuit size={16} />
                      </div>
                      <Text size="sm" font="bold">
                        AI INSIGHTS
                      </Text>
                    </div>
                    {report.aiReport?.__integration ? (
                      <div className="py-4 text-center space-y-2 opacity-60">
                        <Icons.Analytics className="w-8 h-8 mx-auto opacity-20" />
                        <Text size="xs" font="medium" className="italic">
                          AI connection temporarily offline.
                        </Text>
                      </div>
                    ) : report.aiReport ? (
                      <div className="relative">
                        <span className="absolute -left-2 -top-1 text-2xl text-primary-400">
                          "
                        </span>
                        <Text size="sm" color={"primary-100"} font={"medium"}>
                          {typeof report.aiReport === "string"
                            ? report.aiReport
                            : "SecureMail AI has verified the threat pattern based on heuristic behavior analysis."}
                        </Text>
                        <span className="absolute -right-1 bottom-0 text-2xl text-primary-400/30">
                          "
                        </span>
                      </div>
                    ) : (
                      <Text size="xs" className="text-primary-400">
                        No additional AI analysis available for this report.
                      </Text>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
