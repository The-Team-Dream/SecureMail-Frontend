import { EmailFolder } from "@/APIs/types/Email";
import { Icons } from "./icons";

export const SOCIAL_PLATFORMS = [
  "google",
  "facebook",
  "twitter",
  "x.com",
  "linkedin",
  "instagram",
  "reddit",
  "tiktok",
  "pinterest",
  "youtube",
  "snapchat",
  "whatsapp",
  "discord",
  "twitch",
  "quora",
  "github",
];

export const PROMOTION_KEYWORDS = [
  "amazon",
  "jumia",
  "noon",
  "netflix",
  "spotify",
  "uber",
  "careem",
  "talabat",
  "aliexpress",
  "shein",
  "temu",
  "airbnb",
  "booking",
  "agoda",
  "canva",
  "no-reply",
  "noreply",
  "newsletter",
  "offers",
  "marketing",
  "promotions",
  "discount",
  "sale",
  "deals",
  "subscribe",
  "digest",
  "updates",
  "info@",
  "sales@",
];

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
  { name: "Trash", icon: Icons.Delete, folder: "trash" },
];

export const securityNavItems = [
  {
    name: "Security Reports",
    icon: Icons.Reports,
    href: "security-reports",
  },
  { name: "Analytics", icon: Icons.Analytics, href: "analytics" },
  { name: "Phishing", icon: Icons.Phishing, href: "phishing" },
  { name: "Malware", icon: Icons.Malware, href: "malware" },
];
