"use client";

import Logo from "./shared/Logo";
import { SyncLoader } from "react-spinners";
import { Text } from "./shared/Text";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
interface SplashPreloaderProps {
  children: React.ReactNode;
}

export default function SplashPreloader({ children }: SplashPreloaderProps) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const hasSplash = localStorage.getItem("hasSplash");
    const displayTime = hasSplash ? 1000 : 2000;
    const timer = setTimeout(() => {
      setLoading(false);
      if (!hasSplash) {
        localStorage.setItem("hasSplash", "true");
      }
    }, displayTime);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="flex flex-col items-center">
              <Logo />
              <SyncLoader
                color="var(--color-primary)"
                size={10}
                className="mb-4 mt-2"
              />
              <Text>Preparing for a secure journey...</Text>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      >
        {children}
      </motion.div>
    </>
  );
}
