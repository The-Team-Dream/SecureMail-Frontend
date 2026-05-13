import { create } from "zustand";
import type { EmailFolder as Folder, Classification } from "@/APIs/types/Email";

interface MailState {
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
    fromName?: string;
    receivedAt?: string;
    bodyHtml?: string;
  } | null;

  setActiveFolder: (folder: Folder) => void;
  setActiveClassification: (classification: Classification) => void;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setComposeOpen: (
    isOpen: boolean,
    config?: {
      mode: "new" | "reply" | "forward";
      data?: { 
      to?: string; 
      subject?: string; 
      body?: string; 
      emailId?: string;
      fromName?: string;
      receivedAt?: string;
      bodyHtml?: string;
    };
    },
  ) => void;
  toggleSelectEmail: (id: string) => void;
  deselectAll: () => void;
  getUnreadCount: (classification: Classification) => number;
}

export const useMailStore = create<MailState>((set, get) => ({
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

  deselectAll: () => {
    set({ selectedIds: [] });
  },

  // Stubbed out since API handles unread counts (if needed in the future)
  getUnreadCount: () => {
    return 0;
  },
}));
