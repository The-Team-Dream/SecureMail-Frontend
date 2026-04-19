import {
  TrendingUp,
  TrendingDown,
  CircleX,
  ShieldAlert,
  LucideIcon,
} from "lucide-react";
type StatType = "increase" | "decrease" | "healthy";

type NotificationSeverity = "HIGH" | "MEDIUM" | "INFO";
type NotificationType = "error" | "info" | "warning";

export interface StatItem {
  id: number;
  title: string;
  value: string;
  change?: string;
  status?: string;
  type: StatType;
  icon: LucideIcon | null;
  description: string | null;
}

export interface NotificationItem {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  severity: NotificationSeverity;
  type: NotificationType;
  icon: LucideIcon;
}

export const stats: StatItem[] = [
  {
    id: 1,
    title: "Total Threats Blocked",
    value: "5,345",
    change: "4%",
    type: "increase",
    icon: TrendingUp,
    description: "Comparison vs previous 30 days",
  },
  {
    id: 2,
    title: "Critical Alerts",
    value: "149.64",
    change: "24%",
    type: "decrease",
    icon: TrendingDown,
    description: "Active incidents requiring attention",
  },
  {
    id: 3,
    title: "System Health",
    value: "87.9%",
    status: "Stable",
    type: "healthy",
    icon: null,
    description: null,
  },
];

export const notifications: NotificationItem[] = [
  {
    id: 1,
    title: "Unauthorized Access Atte...",
    subtitle: "IP: 192.168.1.254 • Location:Unknown",
    time: "5 minutes ago",
    severity: "HIGH",
    type: "error",
    icon: CircleX,
  },
  {
    id: 2,
    title: "SSL Certificate Renewed",
    subtitle: "Domain: secure.mail-service.io",
    time: "2 hour ago",
    severity: "INFO",
    type: "info",
    icon: CircleX,
  },
  {
    id: 3,
    title: "Policy Update Detected",
    subtitle: "Filter: Restricted Attachments",
    time: "5 hours ago",
    severity: "MEDIUM",
    type: "warning",
    icon: ShieldAlert,
  },
];
