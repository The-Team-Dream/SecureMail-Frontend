import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "../styles/globals.css";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import { Toaster } from "sonner";
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
        suppressHydrationWarning
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
            <Toaster position="top-left" />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
