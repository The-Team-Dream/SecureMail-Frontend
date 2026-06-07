import React from "react";
import { MapPin, CheckCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Stat = {
  id: number;
  label: string;
  value: string;
  badgeClass: string;
  badgeText: string;
};

export type ListItem = {
  id: number;
  badgeClass: string;
  badge: string;
  time: string;
  title: string;
  description: string;
  meta: React.ReactNode;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

export const stats: Stat[] = [
  {
    id: 1,
    label: "Critical",
    value: "12",
    badgeClass: "bg-secondary-200 text-secondary-900",
    badgeText: "+14%",
  },
  {
    id: 2,
    label: "Resolved",
    value: "4",
    badgeClass: "bg-error-50 text-error-500",
    badgeText: "+82%",
  },
  {
    id: 3,
    label: "Pending",
    value: "2",
    badgeClass: "bg-secondary-200 text-secondary-900",
    badgeText: "10%",
  },
];

export const listItems: ListItem[] = [
  {
    id: 1,
    badgeClass: "bg-error-50 text-error-500",
    badge: "CRITICAL THREAT",
    time: "2m ago",
    title: "Phishing Attempt: IT Support",
    description: "Targeting: CEO Office · Source: external-mail.net",
    meta: (
      <div className="flex items-center gap-2 mt-1">
        <div className="flex -space-x-1">
          {["JD", "AS"].map((initials) => (
            <div
              key={initials}
              className="w-6 h-6 rounded-full border border-secondary-800 bg-secondary-100 text-secondary-900 flex items-center justify-center text-[10px] font-bold"
            >
              {initials}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 2,
    badgeClass: "bg-warning-50 text-warning-600",
    badge: "SUSPICIOUS ACTIVITY",
    time: "45m ago",
    title: "Bulk Data Export Request",
    description: "Origin: Unusual IP (Shanghai) · Volume: 4.2GB",
    meta: (
      <div className="flex items-center gap-1 mt-1 text-xs text-secondary-800">
        <MapPin className="w-3 h-3" />
        <span className="font-medium">Shanghai, CN</span>
      </div>
    ),
  },
  {
    id: 3,
    badgeClass: "bg-background text-secondary-600",
    badge: "SYSTEM UPDATE",
    time: "2h ago",
    title: "Firewall Rules Updated",
    description: "Auto-remediation successful for port 8080",
    meta: (
      <div className="flex items-center gap-1.5 mt-1 text-xs text-secondary-800">
        <CheckCircle className="w-3 h-3" />
        <span className="font-medium">Resolved Automatically</span>
      </div>
    ),
  },
];
