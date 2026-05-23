"use client";

import React, { useState, useEffect } from "react";
import { Pause, Play, Trash2, Loader2, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useScanQueueStatus, useControlScanQueue } from "@/APIs/hooks/emails";
import { cn } from "@/lib/utils";

export const ScanQueueBanner = ({ mailboxId: propMailboxId }: { mailboxId?: string }) => {
  const params = useParams();
  const mailboxId = propMailboxId || (params.mailboxId as string);

  const { data: queue } = useScanQueueStatus(mailboxId);
  const controlMutation = useControlScanQueue(mailboxId);

  const [localIsPaused, setLocalIsPaused] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Sync isPaused from server only when no control action is in flight
  useEffect(() => {
    if (queue && !controlMutation.isPending) {
      setLocalIsPaused(queue.isPaused);
    }
  }, [queue?.isPaused, controlMutation.isPending]);

  // Re-show banner when new jobs arrive
  useEffect(() => {
    if (queue && (queue.activeCount > 0 || queue.waitingCount > 0)) {
      setDismissed(false);
    }
  }, [queue?.activeCount, queue?.waitingCount]);

  const handlePause = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalIsPaused(true);
    try {
      await controlMutation.mutateAsync("pause");
      toast.success("Scanning pipeline paused");
    } catch {
      setLocalIsPaused(false);
      toast.error("Failed to pause queue");
    }
  };

  const handleResume = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalIsPaused(false);
    try {
      await controlMutation.mutateAsync("resume");
      toast.success("Scanning pipeline resumed");
    } catch {
      setLocalIsPaused(true);
      toast.error("Failed to resume queue");
    }
  };

  const handleClear = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Clear all waiting scans?")) return;
    try {
      await controlMutation.mutateAsync("clear");
      toast.success("Queue cleared");
    } catch {
      toast.error("Failed to clear queue");
    }
  };

  const activeCount = queue?.activeCount ?? 0;
  const waitingCount = queue?.waitingCount ?? 0;
  const totalInQueue = activeCount + waitingCount;

  // Only show when there are actual jobs in the BullMQ queue
  if (totalInQueue === 0 || dismissed) return null;

  return (
    <div
      className={cn(
        "mx-2 mb-2 rounded-2xl overflow-hidden border shadow-sm",
        localIsPaused
          ? "bg-amber-50 border-amber-200"
          : "bg-primary-50 border-primary-200"
      )}
    >
      {/* ── Progress Bar: indeterminate animation when active, static when paused ── */}
      <div className="relative h-1.5 w-full bg-primary-100 overflow-hidden">
        {localIsPaused ? (
          // Paused: static amber bar
          <div className="h-full w-1/3 bg-amber-400" />
        ) : (
          // Scanning: sliding indeterminate animation
          <div
            className="absolute h-full bg-primary-500 rounded-full animate-[scan-slide_1.8s_ease-in-out_infinite]"
            style={{ width: "40%" }}
          />
        )}
      </div>

      {/* ── Banner Body ── */}
      <div className="flex items-center justify-between px-4 py-2.5 gap-3 flex-wrap">

        {/* Left: Icon + Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-xl shrink-0",
              localIsPaused
                ? "bg-amber-100 text-amber-600"
                : "bg-primary-100 text-primary-600"
            )}
          >
            {localIsPaused ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            {/* Title */}
            <span
              className={cn(
                "text-xs font-bold",
                localIsPaused ? "text-amber-700" : "text-primary-800"
              )}
            >
              {localIsPaused ? "Queue Paused" : "AI Security Scanning"}
            </span>

            {/* Queue counts — only BullMQ real-time data */}
            <div className="flex items-center gap-3 mt-0.5">
              {activeCount > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-primary-600 font-medium">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {activeCount} scanning now
                </span>
              )}
              {waitingCount > 0 && (
                <span className="text-[11px] text-primary-400 font-medium">
                  {waitingCount} waiting
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* Pause / Resume toggle */}
          <button
            onClick={localIsPaused ? handleResume : handlePause}
            disabled={controlMutation.isPending}
            title={localIsPaused ? "Resume scanning" : "Pause scanning"}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50",
              localIsPaused
                ? "bg-primary-600 hover:bg-primary-700 text-white"
                : "bg-amber-100 hover:bg-amber-200 text-amber-700"
            )}
          >
            {controlMutation.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : localIsPaused ? (
              <Play className="w-3 h-3" />
            ) : (
              <Pause className="w-3 h-3" />
            )}
            {localIsPaused ? "Resume" : "Pause"}
          </button>

          {/* Clear waiting — only when there are waiting jobs */}
          {waitingCount > 0 && (
            <button
              onClick={handleClear}
              disabled={controlMutation.isPending}
              title="Clear all waiting scans"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-error-600 bg-error-50 hover:bg-error-100 transition-all disabled:opacity-50"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          )}

          {/* Dismiss */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDismissed(true);
            }}
            title="Dismiss banner"
            className="p-1.5 rounded-lg text-primary-400 hover:text-primary-600 hover:bg-primary-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
