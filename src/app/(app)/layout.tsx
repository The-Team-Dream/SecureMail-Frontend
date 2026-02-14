import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../../styles/globals.css";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "@/_components/ProtectedRoute";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SecureMail",
  description: "A Securemail system that protects you from danger ! :)",
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
      <body className={`${montserrat.variable} antialiased`}>
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
