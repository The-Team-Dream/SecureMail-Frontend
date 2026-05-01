import { create } from "zustand";
import type { Email, Folder, Classification } from "@/types/mail";
import { mockEmails } from "@/app/(main)/mailboxes/[mailboxId]/[folder]/MOCKDATA"; 

const ITEMS_PER_PAGE = 18;

interface MailState {
  emails: Email[];
  activeFolder: Folder;
  activeClassification: Classification;
  currentPage: number;
  selectedIds: string[];
  searchQuery: string;
  isComposeOpen: boolean;
  composeMode: "new" | "reply" | "forward";
  composeData: {
    to?: string;
    subject?: string;
    body?: string;
    emailId?: string;
  } | null;

  setActiveFolder: (folder: Folder) => void;
  setActiveClassification: (classification: Classification) => void;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setComposeOpen: (
    isOpen: boolean,
    config?: {
      mode: "new" | "reply" | "forward";
      data?: { to?: string; subject?: string; body?: string; emailId?: string };
    },
  ) => void;
  toggleSelectEmail: (id: string) => void;
  selectAllOnPage: () => void;
  deselectAll: () => void;
  toggleStarEmail: (id: string) => void;
  toggleReadEmail: (id: string) => void;
  deleteEmail: (id: string) => void;
  deleteSelected: () => void;
  archiveEmail: (id: string) => void;
  archiveSelected: () => void;
  toggleSelectedRead: () => void;
  reclassifyEmail: (id: string, folder: Folder) => void;
  moveSelectedTo: (folder: Folder) => void;
  reorderEmails: (fromIndex: number, toIndex: number) => void;
  getFilteredEmails: () => Email[];
  getPagedEmails: () => Email[];
  getTotalPages: () => number;
  getUnreadCount: (classification: Classification) => number;
  getPaginationInfo: () => { start: number; end: number; total: number };
}

export const useMailStore = create<MailState>((set, get) => ({
  emails: mockEmails,
  activeFolder: "inbox",
  activeClassification: "primary",
  currentPage: 1,
  selectedIds: [],
  searchQuery: "",
  isComposeOpen: false,
  composeMode: "new" as "new" | "reply" | "forward",
  composeData: null,

  setActiveFolder: (folder: Folder) => {
    set({
      activeFolder: folder,
      currentPage: 1,
      selectedIds: [],
      activeClassification: "primary",
    });
  },
  setActiveClassification: (classification: Classification) => {
    set({
      activeClassification: classification,
      currentPage: 1,
      selectedIds: [],
    });
  },
  setCurrentPage: (page: number) => {
    set({
      currentPage: page,
      selectedIds: [],
    });
  },

  setSearchQuery: (query: string) => {
    set({
      searchQuery: query,
      currentPage: 1,
    });
  },

  setComposeOpen: (isOpen: boolean, config) => {
    set({
      isComposeOpen: isOpen,
      composeMode: config?.mode || "new",
      composeData: config?.data || null,
    });
  },

  toggleSelectEmail: (id: string) => {
    const { selectedIds } = get();
    if (selectedIds.includes(id)) {
      set({ selectedIds: selectedIds.filter((sid) => sid !== id) });
    } else {
      set({ selectedIds: [...selectedIds, id] });
    }
  },

  selectAllOnPage: () => {
    const pagedEmails = get().getPagedEmails();
    const pagedIds = pagedEmails.map((e) => e.id);
    const { selectedIds } = get();

    const allSelected =
      pagedIds.length > 0 && pagedIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      set({ selectedIds: selectedIds.filter((id) => !pagedIds.includes(id)) });
    } else {
      const newSelectedIds = [...new Set([...selectedIds, ...pagedIds])];
      set({ selectedIds: newSelectedIds });
    }
  },

  deselectAll: () => {
    set({ selectedIds: [] });
  },

  toggleStarEmail: (id: string) => {
    set({
      emails: get().emails.map((email) =>
        email.id === id ? { ...email, isStarred: !email.isStarred } : email,
      ),
    });
  },

  toggleReadEmail: (id: string) => {
    set({
      emails: get().emails.map((email) =>
        email.id === id ? { ...email, isRead: !email.isRead } : email,
      ),
    });
  },
  deleteEmail: (id: string) => {
    set({
      emails: get().emails.map((email) =>
        email.id === id
          ? { ...email, folder: "trash" as Folder, isStarred: false }
          : email,
      ),

      selectedIds: get().selectedIds.filter((sid) => sid !== id),
    });
  },

  archiveEmail: (id: string) => {
    set({
      emails: get().emails.map((email) =>
        email.id === id ? { ...email, folder: "archive" as Folder } : email,
      ),
      selectedIds: get().selectedIds.filter((sid) => sid !== id),
    });
  },

  deleteSelected: () => {
    const { selectedIds, emails } = get();
    set({
      emails: emails.map((email) =>
        selectedIds.includes(email.id)
          ? { ...email, folder: "trash" as Folder, isStarred: false }
          : email,
      ),
      selectedIds: [],
    });
  },

  archiveSelected: () => {
    const { selectedIds, emails } = get();
    set({
      emails: emails.map((email) =>
        selectedIds.includes(email.id)
          ? { ...email, folder: "archive" as Folder }
          : email,
      ),
      selectedIds: [],
    });
  },

  toggleSelectedRead: () => {
    const { selectedIds, emails } = get();
    set({
      emails: emails.map((email) =>
        selectedIds.includes(email.id)
          ? { ...email, isRead: !email.isRead }
          : email,
      ),
      selectedIds: [],
    });
  },

  reclassifyEmail: (id: string, folder: Folder) => {
    set({
      emails: get().emails.map((email) =>
        email.id === id ? { ...email, folder } : email,
      ),
      selectedIds: get().selectedIds.filter((sid) => sid !== id),
    });
  },

  moveSelectedTo: (folder: Folder) => {
    const { selectedIds, emails } = get();
    set({
      emails: emails.map((email) =>
        selectedIds.includes(email.id) ? { ...email, folder } : email,
      ),
      selectedIds: [],
    });
  },

  reorderEmails: (fromIndex: number, toIndex: number) => {
    const filtered = get().getFilteredEmails();
    const page = get().currentPage;
    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    const pagedEmails = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    const fromEmail = pagedEmails[fromIndex];
    const toEmail = pagedEmails[toIndex];

    if (!fromEmail || !toEmail) return;

    const emails = [...get().emails];
    const mainFromIdx = emails.findIndex((e) => e.id === fromEmail.id);
    const mainToIdx = emails.findIndex((e) => e.id === toEmail.id);

    if (mainFromIdx === -1 || mainToIdx === -1) return;

    [emails[mainFromIdx], emails[mainToIdx]] = [
      emails[mainToIdx],
      emails[mainFromIdx],
    ];

    set({ emails });
  },

  getFilteredEmails: () => {
    const { emails, activeFolder, activeClassification, searchQuery } = get();

    let filtered = emails;

    if (activeFolder === "starred") {
      filtered = filtered.filter((e) => e.isStarred && e.folder !== "trash");
    } else {
      filtered = filtered.filter((e) => e.folder === activeFolder);
    }
    if (activeFolder === "inbox") {
      filtered = filtered.filter(
        (e) => e.classification === activeClassification,
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.sender.toLowerCase().includes(q),
      );
    }

    return filtered;
  },

  getPagedEmails: () => {
    const filtered = get().getFilteredEmails();
    const page = get().currentPage;
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  },

  getTotalPages: () => {
    const filtered = get().getFilteredEmails();
    return Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  },

  getUnreadCount: (classification: Classification) => {
    const { emails } = get();
    return emails.filter(
      (e) =>
        e.folder === "inbox" &&
        e.classification === classification &&
        !e.isRead,
    ).length;
  },
  getPaginationInfo: () => {
    const filtered = get().getFilteredEmails();
    const page = get().currentPage;
    const total = filtered.length;

    if (total === 0) {
      return { start: 0, end: 0, total: 0 };
    }

    const start = (page - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(page * ITEMS_PER_PAGE, total);

    return { start, end, total };
  },
}));
