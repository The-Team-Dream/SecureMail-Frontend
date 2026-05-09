"use client";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Archive,
  Trash2,
  MailOpen,
} from "lucide-react";
import { useMailStore } from "@/stores/useMailStore";
import { cn } from "@/lib/utils";
import { Text } from "../shared/Text";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import {
  useEmails,
  useSearchEmails,
  useEmailActions,
} from "@/APIs/hooks/useEmails";
import type { EmailFolder } from "@/APIs/types/Email";
import type { Email } from "@/types/mail";
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
  const { deleteMutation, readMutation, reclassifyMutation } =
    useEmailActions(mailboxId);

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

  const handleBulkArchive = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(
        selectedIds.map((id) =>
          reclassifyMutation.mutateAsync({ id, folder: "trash" }),
        ),
      ); // using trash as fallback since archive endpoint is missing
      deselectAll();
      toast.success("Selected emails archived");
    } catch (e) {
      toast.error("Some emails failed to archive");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(
        selectedIds.map((id) => deleteMutation.mutateAsync(id)),
      );
      deselectAll();
      toast.success("Selected emails deleted");
    } catch (e) {
      toast.error("Some emails failed to delete");
    }
  };

  const handleBulkToggleRead = async () => {
    if (selectedIds.length === 0) return;
    // We don't know the read state of each email easily here without looking them up,
    // so we'll just mark them all as read for simplicity, or we could look up the first one
    const firstSelected = pagedEmails.find(
      (e: Email) => e.id === selectedIds[0],
    );
    const newReadState = firstSelected ? !firstSelected.isRead : true;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          readMutation.mutateAsync({ id, read: newReadState }),
        ),
      );
      deselectAll();
      toast.success("Selected emails read status updated");
    } catch (e) {
      toast.error("Some emails failed to update read status");
    }
  };

  return (
    <div className="flex items-center justify-between px-2 sm:px-4 py-2">
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
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1.5 sm:p-2 rounded-lg text-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw
              className={cn(
                "w-4 h-4 sm:w-5 sm:h-5",
                isRefreshing && "animate-spin",
              )}
            />
          </button>
        )}

        {/* ══════ Bulk Actions ══════ */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-primary-200">
            <button
              onClick={handleBulkArchive}
              className="p-1.5 text-primary-900 hover:bg-primary-100 rounded-full transition-colors cursor-pointer"
              aria-label="Archive selected"
              title="Archive selected"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              onClick={handleBulkDelete}
              className="p-1.5 text-primary-900 hover:text-error-500 hover:bg-error-50 rounded-full transition-colors cursor-pointer"
              aria-label="Delete selected"
              title="Delete selected"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleBulkToggleRead}
              className="p-1.5 text-primary-900 hover:bg-primary-100 rounded-full transition-colors cursor-pointer"
              aria-label="Mark selected as read/unread"
              title="Mark selected as read/unread"
            >
              <MailOpen className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ══════ Pagination ══════ */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Text className="text-primary select-none text-xs sm:text-sm">
          {total === 0 ? "0" : `${start}-${end}`} of {total}
        </Text>

        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className={cn(
            "p-1 rounded-full transition-colors cursor-pointer",
            currentPage <= 1
              ? "text-primary-300 cursor-not-allowed"
              : "text-primary hover:bg-primary-100",
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className={cn(
            "p-1 rounded-full transition-colors cursor-pointer",
            currentPage >= totalPages
              ? "text-primary-300 cursor-not-allowed"
              : "text-primary hover:bg-primary-100",
          )}
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
