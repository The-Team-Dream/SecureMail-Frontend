"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Star,
  Trash2,
  MailOpen,
  ShieldCheck,
} from "lucide-react";
import { useMailStore } from "@/stores/useMailStore";
import { cn } from "@/lib/utils";
import { Text } from "@/_components/shared/Text";
import { ActionButton } from "@/_components/shared/ActionButton";

import { toast } from "sonner";
import { useParams } from "next/navigation";
import {
  useEmails,
  useSearchEmails,
  useDeleteEmail,
  useReadEmail,
  useReclassifyEmail,
  useScanAllEmails,
  useScanProgress,
  useStarEmail,
} from "@/APIs/hooks/emails";
import type { EmailFolder } from "@/APIs/types/Email";
import type { Email } from "@/APIs/types/Email";
import { useQueryClient } from "@tanstack/react-query";

interface MailToolbarProps {
  showCheckbox?: boolean;
  showRefresh?: boolean;
}

export const MailToolbar = ({
  showCheckbox = true,
  showRefresh = true,
}: MailToolbarProps) => {
  const params = useParams();
  const mailboxId = params.mailboxId as string;
  const queryClient = useQueryClient();

  const currentPage = useMailStore((s) => s.currentPage);
  const selectedIds = useMailStore((s) => s.selectedIds);
  const storeFolder = useMailStore((s) => s.activeFolder) as EmailFolder;
  const storeSearch = useMailStore((s) => s.searchQuery);

  const setCurrentPage = useMailStore((s) => s.setCurrentPage);
  const deselectAll = useMailStore((s) => s.deselectAll);
  const toggleSelectEmail = useMailStore((s) => s.toggleSelectEmail);

  const { data: emailsData, isFetching } = useEmails(
    mailboxId,
    storeFolder,
    currentPage,
  );
  const { data: searchData, isFetching: isSearchingFetching } = useSearchEmails(
    mailboxId,
    storeSearch,
    currentPage,
  );
  const deleteMutation = useDeleteEmail(mailboxId);
  const readMutation = useReadEmail(mailboxId);
  const reclassifyMutation = useReclassifyEmail(mailboxId);
  const scanAllMutation = useScanAllEmails(mailboxId);
  const starMutation = useStarEmail(mailboxId);
  const { data: scanProgress } = useScanProgress(mailboxId);

  const isRefreshing = isFetching || isSearchingFetching;

  const isSearching = storeSearch.trim().length > 0;
  const currentData = (isSearching ? searchData : emailsData) as any;
  const pagedEmails = Array.isArray(currentData)
    ? currentData
    : currentData?.data || [];
  const meta = currentData?.meta;

  const total = meta?.total || 0;
  const totalPages = meta?.totalPages || 1;
  const limit = meta?.limit || 20;
  const start = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = total === 0 ? 0 : Math.min(currentPage * limit, total);
  const pagedIds = pagedEmails.map((e: Email) => String(e.id));

  const isAllSelected =
    pagedIds.length > 0 &&
    pagedIds.every((id: string) => selectedIds.includes(id));
  const isSomeSelected =
    pagedIds.some((id: string) => selectedIds.includes(id)) && !isAllSelected;

  const selectAllOnPage = () => {
    const allSelected =
      pagedIds.length > 0 &&
      pagedIds.every((id: string) => selectedIds.includes(id));
    if (allSelected) {
      useMailStore.setState((s) => ({
        selectedIds: s.selectedIds.filter((id) => !pagedIds.includes(id)),
      }));
    } else {
      useMailStore.setState((s) => ({
        selectedIds: [...new Set([...s.selectedIds, ...pagedIds])],
      }));
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRefresh = async () => {
    deselectAll();
    await queryClient.resetQueries({ queryKey: ["emails", mailboxId] });
    toast.success("Emails refreshed successfully");
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const showToast = selectedIds.length === 1;
    try {
      await Promise.all(
        selectedIds.map((id) => deleteMutation.mutateAsync({ id, showToast })),
      );
      deselectAll();
      if (!showToast) {
        toast.success("selected emails deleted");
      }
    } catch (e) {
      toast.error("Some emails failed to delete");
    }
  };

  const handleBulkToggleRead = async () => {
    if (selectedIds.length === 0) return;
    // We don't know the read state of each email easily here without looking them up,
    // so we'll just mark them all as read for simplicity, or we could look up the first one
    const firstSelected = pagedEmails.find(
      (e: Email) => String(e.id) === String(selectedIds[0]),
    );
    const newReadState = firstSelected ? !firstSelected.isRead : true;
    const showToast = selectedIds.length === 1;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          readMutation.mutateAsync({ id, read: newReadState, showToast }),
        ),
      );
      deselectAll();
      if (!showToast) {
        toast.success(
          newReadState
            ? "selected emails marked as read"
            : "selected emails marked as unread",
        );
      }
    } catch (e) {
      toast.error("Some emails failed to update read status");
    }
  };

  const handleBulkStar = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(
        selectedIds.map((id) =>
          starMutation.mutateAsync({ id, starred: true }),
        ),
      );
      deselectAll();
      toast.success("Selected emails starred");
    } catch (e) {
      toast.error("Some emails failed to star");
    }
  };

  const handleScanAll = () => {
    scanAllMutation.mutate();
  };

  return (
    <div className="relative flex items-center justify-between px-2 sm:px-4 py-2">
      {/* ══════  Checkbox + Refresh ══════ */}
      <div className="flex items-center gap-1">
        {showCheckbox && (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(el) => {
                if (el) {
                  el.indeterminate = isSomeSelected;
                }
              }}
              onChange={selectAllOnPage}
              className="w-4 h-4 rounded border-primary-900 text-secondary-500 focus:ring-secondary-500 cursor-pointer accent-secondary-500"
              aria-label="Select all emails on this page"
            />

            <button
              onClick={selectAllOnPage}
              className="p-0.5 hover:bg-primary-100 rounded transition-colors cursor-pointer"
              aria-label="Toggle select all"
            >
              <ChevronDown className="w-4 h-4 text-primary-900" />
            </button>
          </div>
        )}

        {showRefresh && (
          <ActionButton
            icon={
              <RefreshCw
                className={cn(
                  "w-4 h-4 sm:w-5 sm:h-5",
                  isRefreshing && "animate-spin",
                )}
              />
            }
            label="Refresh"
            onClick={handleRefresh}
            disabled={isRefreshing}
          />
        )}

        <ActionButton
          icon={
            <ShieldCheck
              className={cn(
                "w-4 h-4 sm:w-5 sm:h-5",
                scanAllMutation.isPending && "animate-spin",
              )}
            />
          }
          label="Scan All Emails"
          onClick={handleScanAll}
          disabled={scanAllMutation.isPending}
        />

        {/* ══════ Bulk Actions ══════ */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-primary-200">
            <ActionButton
              icon={<Trash2 className="w-4 h-4" />}
              label="Delete selected"
              onClick={handleBulkDelete}
              variant="danger"
            />
            <ActionButton
              icon={<MailOpen className="w-4 h-4" />}
              label="Mark as read/unread"
              onClick={handleBulkToggleRead}
            />
            <ActionButton
              icon={<Star className="w-4 h-4" />}
              label="Star selected"
              onClick={handleBulkStar}
            />
          </div>
        )}
      </div>

      {/* ══════ Pagination ══════ */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Text className="text-primary select-none text-xs sm:text-sm">
          {total === 0 ? "0" : `${start}-${end}`} of {total}
        </Text>

        <ActionButton
          icon={<ChevronLeft className="w-5 h-5" />}
          label="Previous page"
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
        />

        <ActionButton
          icon={<ChevronRight className="w-5 h-5" />}
          label="Next page"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
        />
      </div>

      {/* ══════ Progress Bar ══════ */}
      {scanProgress?.isScanning && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-100 overflow-hidden">
          <div
            className="h-full bg-secondary-500 transition-all duration-500 ease-in-out"
            style={{ width: `${scanProgress.percentage}%` }}
          />
          <div className="absolute right-2 -top-5 text-[10px] text-secondary-600 font-semibold">
            {scanProgress.completed} / {scanProgress.total} (
            {scanProgress.percentage}%)
          </div>
        </div>
      )}
    </div>
  );
};
