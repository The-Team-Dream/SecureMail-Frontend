"use client";

import Logo from "./shared/Logo";
import { Text } from "./shared/Text";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ShieldCheck, Lock, Eye, Mail } from "lucide-react";

interface SplashPreloaderProps {
  children: React.ReactNode;
}

export default function SplashPreloader({ children }: SplashPreloaderProps) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showSplash, setShowSplash] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    
    if (hasSeenSplash) {
      setLoading(false);
      setShowSplash(false);
      return;
    }

    setShowSplash(true);

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("hasSeenSplash", "true");
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (!mounted) {
    return <div className="bg-background fixed inset-0" />;
  }

  if (!showSplash && !loading) {
    return <>{children}</>;
  }

  const securityIcons = [
    { Icon: ShieldCheck, x: "-25%", y: "-25%", delay: 0.1 },
    { Icon: Lock, x: "25%", y: "-20%", delay: 0.3 },
    { Icon: Eye, x: "-20%", y: "25%", delay: 0.5 },
    { Icon: Mail, x: "20%", y: "20%", delay: 0.7 },
  ];

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-9999 flex flex-col items-center justify-center overflow-hidden bg-background"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.1,
              filter: "blur(10px)",
              transition: { duration: 0.8, ease: "circIn" }
            }}
          >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--secondary-100)_0%,transparent_70%)] opacity-20 dark:opacity-10" />
              
              {securityIcons.map(({ Icon, x, y, delay }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: [0, 0.15, 0],
                    scale: [0.5, 1, 0.8],
                    x: x,
                    y: y,
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    delay: delay,
                    ease: "easeInOut"
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <Icon className="w-12 h-12 text-secondary-500" />
                </motion.div>
              ))}
            </div>

            {/* Main Content */}
            <div className="relative flex flex-col items-center">
              {/* Logo with Glow */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 bg-secondary-400 blur-3xl opacity-20 animate-pulse" />
                <Logo width={80} height={80} textSize="4xl" />
              </motion.div>

              {/* Progress Container */}
              <div className="w-64 space-y-4">
                <div className="h-1.5 w-full bg-primary-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
                
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Text font="medium" size="sm" color="muted" className="tracking-widest uppercase">
                      {progress < 30 ? "Initializing Security..." : 
                       progress < 60 ? "Encrypting Channels..." : 
                       progress < 90 ? "Verifying Protocols..." : 
                       "Welcome to SecureMail"}
                    </Text>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-2"
                  >
                    <Text size="xs" color="muted" className="italic">
                      Version 1.0.1 • Enhanced Encryption Active
                    </Text>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Decor */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-12 flex items-center gap-2"
            >
              <Lock className="w-3 h-3 text-secondary-600" />
              <Text size="xs" color={'secondary-600'} font={'bold'} className="tracking-tighter">
                END-TO-END SECURE ENVIRONMENT
              </Text>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key="content"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ 
          opacity: loading ? 0 : 1,
          scale: loading ? 0.98 : 1,
          filter: loading ? "blur(10px)" : "blur(0px)"
        }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}
