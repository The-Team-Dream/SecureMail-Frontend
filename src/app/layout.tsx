import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../styles/globals.css";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { CheckCheckIcon, X } from "lucide-react";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SecureMail",
  description: "A Securemail system that protects you from danger ! :)",
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
          <Toaster
            position="top-left"
            toastOptions={{
              className: "",
              success: {
                style: {
                  padding: "16px 24px",
                  backgroundColor: "#689300",
                  color: "#fff",
                },
                icon: <CheckCheckIcon className="w-4 h-4 " />,
              },
              error: {
                style: {
                  backgroundColor: "red",
                  padding: "16px 24px",
                  color: "#fff",
                },
                icon: <X className="w-4 h-4 text-white" />,
              },
            }}
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
