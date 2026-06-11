import { EmailFolder } from "@/APIs/types/Email";
import { Icons } from "./icons";

export const dashboardNavItems = [
  { name: "Mailboxes", icon: Icons.Inbox, href: "/mailboxes" },
  { name: "Analytics", icon: Icons.Analytics, href: "/analytics" },
  { name: "Reports", icon: Icons.Reports, href: "/reports" },
  { name: "Settings", icon: Icons.Settings, href: "/settings" },
];

export const mailboxNavItems: {
  name: string;
  icon: React.ElementType;
  folder: EmailFolder;
}[] = [
  { name: "Inbox", icon: Icons.Inbox, folder: "inbox" },
  { name: "Sent", icon: Icons.Sent, folder: "sent" },
  { name: "Star", icon: Icons.Star, folder: "starred" },
  { name: "Spam", icon: Icons.Spam, folder: "spam" },
  { name: "Phishing", icon: Icons.Phishing, folder: "phishing" },
  { name: "Malware", icon: Icons.Malware, folder: "malware" },
  { name: "Trash", icon: Icons.Delete, folder: "trash" },
];

export const securityNavItems = [
  {
    name: "Security Reports",
    icon: Icons.Reports,
    href: "security-reports",
  },
  { name: "Analytics", icon: Icons.Analytics, href: "analytics" },
  { name: "Settings", icon: Icons.Settings, href: "settings" },
];
