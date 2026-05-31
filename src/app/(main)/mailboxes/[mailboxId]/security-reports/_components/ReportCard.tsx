"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Shield,
  BrainCircuit,
  Calendar,
  AlertCircle,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/_components/shared/Text";
import { cn } from "@/lib/utils";
import { SecurityReport } from "@/APIs/types/Report";
import { Icons } from "@/constants/icons";

interface ReportCardProps {
  report: SecurityReport;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ReportCard({ report, isExpanded, onToggle }: ReportCardProps) {
  const classification = report.classification.toLowerCase();

  const theme: Record<string, string> = {
    phishing: {
      bg: "bg-error-50/30",
      text: "text-error-700",
      border: "border-error-100/50",
      accent: "bg-error-600",
      light: "bg-error-50",
      ring: "text-error-500",
    },
    spam: {
      bg: "bg-warning-50/30",
      text: "text-warning-700",
      border: "border-warning-100/50",
      accent: "bg-warning-600",
      light: "bg-warning-50",
      ring: "text-warning-500",
    },
    malware: {
      bg: "bg-error-50/30",
      text: "text-error-700",
      border: "border-error-100/50",
      accent: "bg-error-600",
      light: "bg-error-50",
      ring: "text-error-500",
    },
    clean: {
      bg: "bg-secondary-50/30",
      text: "text-secondary-700",
      border: "border-secondary-100/50",
      accent: "bg-secondary-600",
      light: "bg-secondary-50",
      ring: "text-secondary-500",
    },
  }[classification as keyof typeof theme] || {
    bg: "bg-primary-50/30",
    text: "text-primary-700",
    border: "border-primary-100/50",
    accent: "bg-primary-600",
    light: "bg-primary-50",
    ring: "text-primary-500",
  };

  const iconMap: Record<string, React.ElementType> = {
    phishing: Icons.Phishing,
    spam: Icons.Spam,
    malware: Icons.Malware,
    clean: Icons.Inbox,
  };

  return (
    <div
      className={cn(
        "relative border rounded-3xl bg-background transition-all duration-500 overflow-hidden group",
        isExpanded
          ? "ring-1 ring-primary-200/50 shadow-2xl border-primary-200"
          : "hover:border-primary-300 shadow-xs hover:shadow-xl hover:-translate-y-0.5",
      )}
    >
      {/* Risk Indicator Sidebar */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500",
          theme.accent,
          isExpanded ? "w-2" : "opacity-30 group-hover:opacity-100",
        )}
      />

      {/* Main Header Content */}
      <div className="p-6 cursor-pointer relative z-10" onClick={onToggle}>
        <div className="flex items-center gap-6">
          {/* Risk Score Circle */}
          <div className="relative shrink-0 p-1 bg-background rounded-full shadow-inner border border-primary-50">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="3.5"
                fill="transparent"
                className="text-primary-50"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray={176}
                initial={{ strokeDashoffset: 176 }}
                animate={{
                  strokeDashoffset:
                    176 - (176 * report.classificationScore) / 100,
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
                className={cn("transition-all duration-1000", theme.ring)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Text font="bold" size="sm" className={theme.text}>
                {report.classificationScore}
              </Text>
              <Text
                size="xs"
                className="text-[8px] uppercase tracking-tighter opacity-50 -mt-1 font-bold"
              >
                Risk
              </Text>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Badge
                className={cn(
                  "rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border-none",
                  theme.accent,
                  "text-background shadow-xs",
                )}
              >
                {report.classification}
              </Badge>
              <div className="flex items-center gap-1.5 text-primary-400">
                <Calendar size={13} strokeWidth={2.5} />
                <Text size="xs" font="bold">
                  {new Date(report.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </div>
            </div>

            <Text
              font="bold"
              size="lg"
              className="truncate block mb-1 group-hover:text-primary-900 transition-colors"
            >
              {report.subject}
            </Text>
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-primary-50">
                <Icons.Mail className="w-3 h-3 text-primary-600" />
              </div>
              <Text size="xs" font="medium" className="opacity-50 truncate">
                {report.from}
              </Text>
            </div>
          </div>

          {/* Expand Arrow */}
          <div
            className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300",
              isExpanded
                ? "bg-primary-100 text-primary-700 rotate-180"
                : "bg-primary-50 text-primary-400 group-hover:bg-primary-100 group-hover:text-primary-600",
            )}
          >
            <ChevronDown size={20} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-8 pt-2 bg-ghostBlue/20 border-t border-primary-50">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Threat Analysis */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="bg-background rounded-3xl p-6 shadow-sm border border-primary-100/50">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 rounded-xl bg-error-50 text-error-600 shadow-inner">
                        <Activity size={18} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <Text
                          size="xs"
                          font="black"
                          className="uppercase tracking-[0.2em] opacity-40 leading-none mb-1"
                        >
                          Investigation
                        </Text>
                        <Text
                          size="sm"
                          font="bold"
                          className="text-primary-950 uppercase tracking-tight"
                        >
                          System Verdict
                        </Text>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-primary-50/50 border border-primary-100/50">
                        <Text
                          size="sm"
                          font="medium"
                          className="leading-relaxed text-primary-800"
                        >
                          {report.classificationReason}
                        </Text>
                      </div>

                      {report.malwareVerdict && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-5 rounded-2xl bg-linear-to-br from-error-50/80 to-transparent border border-error-100/50 shadow-xs"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-5 h-5 text-error-600" />
                              <Text
                                size="xs"
                                font="black"
                                className="text-error-700 uppercase tracking-widest"
                              >
                                MALWARE PAYLOAD
                              </Text>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-background border-error-200 text-error-700 font-black px-3 py-1 rounded-full"
                            >
                              {report.malwareSeverity}
                            </Badge>
                          </div>

                          <Text
                            size="lg"
                            font="bold"
                            className="text-error-900 mb-5 block"
                          >
                            {report.malwareVerdict}
                          </Text>

                          <div className="space-y-2">
                            <div className="flex justify-between items-end">
                              <Text
                                size="xs"
                                font="black"
                                className="text-error-600 uppercase tracking-tighter opacity-60"
                              >
                                Payload Confidence
                              </Text>
                              <Text
                                size="sm"
                                font="black"
                                className="text-error-700"
                              >
                                {report.malwareScore}%
                              </Text>
                            </div>
                            <div className="w-full h-2.5 bg-error-100 rounded-full overflow-hidden p-0.5 border border-error-200/50 shadow-inner">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${report.malwareScore}%` }}
                                transition={{
                                  duration: 1.2,
                                  delay: 0.3,
                                  ease: "easeOut",
                                }}
                                className="h-full bg-linear-to-r from-error-400 to-error-600 rounded-full shadow-xs"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Meta & AI Insights */}
                <div className="lg:col-span-5 space-y-6">
                  {/* AI Card */}
                  <div className="bg-linear-to-br from-primary-900 to-primary-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group/ai">
                    <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary-400/10 rounded-full blur-3xl" />
                    <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-secondary-400/10 rounded-full blur-2xl" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-background/10 text-primary-100 backdrop-blur-md shadow-xs border border-background/10">
                          <BrainCircuit size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                          <Text
                            size="xs"
                            font="black"
                            className="uppercase tracking-[0.2em] text-primary-300 leading-none mb-1"
                          >
                            Advanced AI
                          </Text>
                          <Text
                            size="sm"
                            font="bold"
                            className="text-background uppercase tracking-tight"
                          >
                            Neural Analysis
                          </Text>
                        </div>
                      </div>

                      <div className="relative p-5 rounded-2xl bg-background/5 border border-background/5 backdrop-blur-xs">
                        <Shield className="absolute -right-1 -top-1 w-12 h-12 text-background/5 rotate-12" />
                        <Text
                          size="sm"
                          font="medium"
                          className="text-background italic leading-relaxed"
                        >
                          {(() => {
                            if (!report.aiReport) return "Heuristic pattern matched with high-confidence threat signatures found in our global threat database.";
                            const ai = report.aiReport as any;
                            return ai.summary || ai.explanation || ai.verdict || "Advanced neural analysis identified suspicious patterns consistent with identified threat vectors.";
                          })()}
                        </Text>
                      </div>

                      {((report.aiReport as any)?.recommendation) && (
                        <div className="mt-4 p-3 rounded-xl bg-background/10 border border-background/5">
                           <Text size="xs" font="bold" className="text-primary-200 uppercase mb-1">Recommendation</Text>
                           <Text size="xs" className="text-primary-100 italic">{(report.aiReport as any).recommendation}</Text>
                        </div>
                      )}

                      {/* Compact Insights Row */}
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {report.aiReport && (report.aiReport as any).isCampaign && (
                          <div className="px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-2">
                            <Icons.Mail className="w-3 h-3 text-purple-300" />
                            <Text size="xs" className="text-purple-100 font-bold">Campaign</Text>
                          </div>
                        )}
                        {report.aiReport && (report.aiReport as any).behavioralAnomaly && (
                          <div className="px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-2">
                            <Activity className="w-3 h-3 text-orange-300" />
                            <Text size="xs" className="text-orange-100 font-bold">Anomaly</Text>
                          </div>
                        )}
                        {report.aiReport && (report.aiReport as any).priority && (
                          <div className="px-3 py-2 rounded-xl bg-background/10 border border-background/10 flex items-center gap-2">
                            <AlertCircle className="w-3 h-3 text-primary-300" />
                            <Text size="xs" className="text-primary-100 font-bold">{(report.aiReport as any).priority} Priority</Text>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex items-center gap-3 px-1">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full border-2 border-primary-800 bg-primary-700 flex items-center justify-center"
                            >
                              <div className="w-1 h-1 rounded-full bg-primary-100" />
                            </div>
                          ))}
                        </div>
                        <Text
                          size="xs"
                          font="bold"
                          className="text-primary-400 uppercase tracking-tighter"
                        >
                          AI Consensus reached
                        </Text>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Info */}
                  <div className="bg-background rounded-3xl p-5 border border-primary-100/50 shadow-xs flex items-center justify-between group-hover:border-primary-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-secondary-50 text-secondary-600">
                        <Shield size={16} strokeWidth={2.5} />
                      </div>
                      <Text
                        size="xs"
                        font="bold"
                        className="text-primary-700 uppercase tracking-wide"
                      >
                        Threat ID: #{report.id.toString().slice(-6)}
                      </Text>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-30">
                      <Activity size={12} strokeWidth={2.5} />
                      <Text size="xs" font="bold">
                        LIVE
                      </Text>
                    </div>
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
