import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getInitials(name: string) {
  if (!name) return "";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function getImageUrl(path: string | null | undefined) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) return path;
  // If no baseURL is needed because of proxy, we can just ensure leading slash:
  return path.startsWith("/") ? path : `/${path}`;
}

export function getFirstName(name: string | null | undefined) {
  if (!name) return "";
  return name.replace(/([A-Z])/g, " $1").trim().split(/\s+/)[0];
}

