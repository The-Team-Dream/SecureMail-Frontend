"use client";
import { Text } from "@/_components/shared/Text";
import { ShieldCheck, ShieldAlert, Lock, Smartphone, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SecuritySummaryProps {
  isVerified: boolean;
  lastSession?: {
    ipAddress: string;
    deviceOs: string;
    loginAt: string;
  };
}

export const SecuritySummary = ({ isVerified, lastSession }: SecuritySummaryProps) => {
  // Calculate security score based on verification
  const score = isVerified ? 100 : 50;
  const isHealthy = isVerified;

  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-background border border-primary-100 p-8 h-full shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <Text size="lg" font="bold">Security Health</Text>
        <div className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
          isHealthy ? "bg-secondary-100 text-secondary-800" : "bg-warning-100 text-warning-800"
        )}>
          {isHealthy ? "Protected" : "Action Required"}
        </div>
      </div>

      {/* Security Score Meter */}
      <div className="relative flex flex-col items-center justify-center py-6">
        <div className="relative h-32 w-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-primary-50"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={364}
              strokeDashoffset={364 - (364 * score) / 100}
              className={cn(
                "transition-all duration-1000 ease-out",
                isHealthy ? "text-secondary-800" : "text-warning-600"
              )}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <Text size="3xl" font="bold" className="leading-none">{score}</Text>
            <Text size="xs" color="primary-400">Score</Text>
          </div>
        </div>
      </div>

      {/* Security Checks */}
      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-primary-50/50 border border-primary-100/30">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", isVerified ? "bg-secondary-100 text-secondary-800" : "bg-warning-100 text-warning-800")}>
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <Text size="sm" font="medium">Email Verification</Text>
              <Text size="xs" color="primary-400">{isVerified ? "Verified" : "Please verify your email"}</Text>
            </div>
          </div>
          {isVerified ? <ShieldCheck className="w-5 h-5 text-secondary-800" /> : <ShieldAlert className="w-5 h-5 text-warning-600" />}
        </div>
      </div>

      {/* Last Session */}
      {lastSession && (
        <div className="mt-2 pt-6 border-t border-primary-50">
          <Text size="xs" font="bold" color="primary-400" className="uppercase tracking-widest mb-4">Last Active Session</Text>
          <div className="flex items-center justify-between text-primary-600">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <Text size="xs">{lastSession.ipAddress}</Text>
            </div>
            <Text size="xs" font="medium">{lastSession.deviceOs}</Text>
          </div>
        </div>
      )}
    </div>
  );
};
