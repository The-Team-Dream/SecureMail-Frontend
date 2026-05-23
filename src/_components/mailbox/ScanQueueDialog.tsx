"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useScanQueueStatus,
  useControlScanQueue,
  useCancelScanJob,
} from "@/APIs/hooks/emails";
import {
  Pause,
  Play,
  Trash2,
  XCircle,
  Loader2,
  ListOrdered,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface ScanQueueDialogProps {
  mailboxId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScanQueueDialog = ({
  mailboxId,
  isOpen,
  onOpenChange,
}: ScanQueueDialogProps) => {
  const { data: queue, isLoading, isError, refetch } = useScanQueueStatus(mailboxId);
  const controlMutation = useControlScanQueue(mailboxId);
  const cancelMutation = useCancelScanJob(mailboxId);

  // Local isPaused state — updated immediately on click, synced from server on load
  const [localIsPaused, setLocalIsPaused] = useState<boolean>(false);

  // Sync from server data only when not actively doing a control action
  useEffect(() => {
    if (queue && !controlMutation.isPending) {
      setLocalIsPaused(queue.isPaused);
    }
  }, [queue?.isPaused, controlMutation.isPending]);

  const handlePause = async () => {
    setLocalIsPaused(true); // Flip immediately — no waiting for server
    try {
      await controlMutation.mutateAsync("pause");
      toast.success("Scanning pipeline paused");
    } catch {
      setLocalIsPaused(false); // Rollback on error
      toast.error("Failed to pause queue");
    }
  };

  const handleResume = async () => {
    setLocalIsPaused(false); // Flip immediately — no waiting for server
    try {
      await controlMutation.mutateAsync("resume");
      toast.success("Scanning pipeline resumed");
    } catch {
      setLocalIsPaused(true); // Rollback on error
      toast.error("Failed to resume queue");
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to clear all waiting scans? This will cancel all pending jobs.")) {
      return;
    }
    try {
      await controlMutation.mutateAsync("clear");
      toast.success("Scanning queue cleared completely");
    } catch {
      toast.error("Failed to clear queue");
    }
  };

  const handleCancelJob = async (emailId: number) => {
    try {
      await cancelMutation.mutateAsync(emailId);
      toast.success(`Scan job for Email #${emailId} cancelled`);
    } catch {
      toast.error("Failed to cancel scan job");
    }
  };

  const isWorking = isLoading || controlMutation.isPending || cancelMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border border-primary-100 rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[85vh]">
        <DialogHeader className="border-b border-primary-50 pb-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600">
                <ListOrdered className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-primary-900">
                  Security Scanning Queue
                </DialogTitle>
                <Text size="xs" className="text-primary-500">
                  Monitor and control real-time AI & Malware scan pipelines
                </Text>
              </div>
            </div>

            <button
              onClick={() => refetch()}
              disabled={isWorking}
              className="p-2 rounded-xl text-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50"
              title="Refresh Queue"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            <Text size="sm" className="text-primary-500">Loading queue status...</Text>
          </div>
        ) : isError ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto gap-3">
            <AlertCircle className="w-12 h-12 text-error-500" />
            <Text font="bold" className="text-primary-950">Failed to load queue</Text>
            <Text size="sm" className="text-primary-500">
              There was an issue contacting the Redis queue server. Please verify the backend is running.
            </Text>
            <Button onClick={() => refetch()} variant="outline" className="mt-2">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Control Dashboard Header Card */}
            <div className="p-4 rounded-2xl bg-primary-50/50 border border-primary-100/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Badge
                  variant={localIsPaused ? "destructive" : "default"}
                  className={`px-3 py-1 font-bold rounded-full text-xs ${
                    localIsPaused
                      ? "bg-amber-100 text-amber-700 border-amber-200"
                      : "bg-success-100 text-success-700 border-success-200"
                  }`}
                >
                  {localIsPaused ? "Paused" : "Running"}
                </Badge>
                <div className="flex items-center gap-4 text-xs font-semibold text-primary-600">
                  <span>Active: {queue?.activeCount}</span>
                  <span className="w-1 h-1 bg-primary-300 rounded-full" />
                  <span>Waiting: {queue?.waitingCount}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {localIsPaused ? (
                  <Button
                    onClick={handleResume}
                    disabled={isWorking}
                    size="sm"
                    className="flex-1 sm:flex-initial h-9 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold"
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5" /> Resume Pipeline
                  </Button>
                ) : (
                  <Button
                    onClick={handlePause}
                    disabled={isWorking}
                    size="sm"
                    className="flex-1 sm:flex-initial h-9 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                  >
                    <Pause className="w-3.5 h-3.5 mr-1.5" /> Pause Queue
                  </Button>
                )}

                <Button
                  onClick={handleClear}
                  disabled={isWorking || queue?.waitingCount === 0}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-initial h-9 px-4 rounded-xl border-error-100 hover:bg-error-50 text-error-600 hover:text-error-700 font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear All Waiting
                </Button>
              </div>
            </div>

            {/* Jobs Container */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              {/* Active Jobs */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-success-500 animate-ping" />
                  <Text font="bold" size="sm" className="text-primary-800 uppercase tracking-wide">
                    Currently Scanning ({queue?.activeCount})
                  </Text>
                </div>

                {queue?.active && queue.active.length > 0 ? (
                  <div className="space-y-2">
                    {queue.active.map((job) => (
                      <div
                        key={job.jobId}
                        className="p-4 rounded-xl border border-primary-100/60 bg-white flex items-center justify-between hover:border-primary-200 transition-colors"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <Loader2 className="w-4 h-4 text-primary-500 animate-spin shrink-0" />
                          <div className="overflow-hidden">
                            <Text font="bold" size="sm" className="text-primary-900 truncate">
                              Email ID: {job.emailId}
                            </Text>
                            <Text size="xs" className="text-primary-500 truncate">
                              Message-ID: {job.messageId}
                            </Text>
                            <Text size="xs" className="text-primary-400">
                              Enqueued at: {new Date(job.addedAt).toLocaleTimeString()}
                            </Text>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleCancelJob(job.emailId)}
                          disabled={isWorking}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-lg text-primary-400 hover:text-error-600 hover:bg-error-50 transition-colors"
                          title="Cancel Scan"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-dashed border-primary-100 bg-primary-50/20 text-center">
                    <Text size="sm" className="text-primary-500">
                      No email scans currently running.
                    </Text>
                  </div>
                )}
              </div>

              {/* Waiting Queue */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Text font="bold" size="sm" className="text-primary-800 uppercase tracking-wide">
                    Waiting in Queue ({queue?.waitingCount})
                  </Text>
                </div>

                {queue?.waiting && queue.waiting.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {queue.waiting.map((job, index) => (
                      <div
                        key={job.jobId}
                        className="p-4 rounded-xl border border-primary-50 bg-primary-50/10 flex items-center justify-between hover:border-primary-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <Badge variant="outline" className="h-6 w-6 rounded-full flex items-center justify-center p-0 font-bold bg-white border-primary-200 text-primary-600 text-[10px]">
                            {index + 1}
                          </Badge>
                          <div className="overflow-hidden">
                            <Text font="semiBold" size="sm" className="text-primary-800 truncate">
                              Email ID: {job.emailId}
                            </Text>
                            <Text size="xs" className="text-primary-500 truncate">
                              Message-ID: {job.messageId}
                            </Text>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleCancelJob(job.emailId)}
                          disabled={isWorking}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-lg text-primary-400 hover:text-error-600 hover:bg-error-50 transition-colors"
                          title="Remove from queue"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-dashed border-primary-100 bg-primary-50/20 text-center">
                    <Text size="sm" className="text-primary-500">
                      Queue is empty. All caught up! ✨
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
