import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "../styles/globals.css";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { CheckCheckIcon, X } from "lucide-react";
import { ThemeProvider } from "@/utils/providers/ThemeProvider";
import SplashPreloader from "@/_components/SplashScreen";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const inter = Inter({
  variable: "--font-inter",
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
      <body
        className={`${montserrat.variable} ${inter.variable} antialiased transition-colors duration-500`}
      >
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            themes={["light", "dark"]}
          >
            <SplashPreloader>{children}</SplashPreloader>
            <Toaster
              position="top-left"
              toastOptions={{
                className: "",
                success: {
                  style: {
                    padding: "16px 24px",
                    backgroundColor: "var(--secondary-800)",
                    color: "#ffffff",
                  },
                  icon: <CheckCheckIcon className="h-4 w-4" />,
                },
                error: {
                  style: {
                    backgroundColor: "var(--error-600)",
                    padding: "16px 24px",
                    color: "#ffffff",
                  },
                  icon: <X className="w-4 h-4 text-white" />,
                },
              }}
            />
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
