import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "../../styles/globals.css";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SecureMail",
  description: "A Securemail system that protects you from danger ssafsa ! :)",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: dark)",
        url: "/icons/logo_dark.png",
        href: "/icons/logo_dark.png",
      },
      {
        media: "(prefers-color-scheme: light)",
        url: "/icons/logo_light.png",
        href: "/icons/logo_light.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
