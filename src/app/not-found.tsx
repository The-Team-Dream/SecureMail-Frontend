"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Mail,
  ChevronLeft,
  Search,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/_components/shared/Text";
import Logo from "@/_components/shared/Logo";

const NotFound = () => {
  return (
    <main className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Grid and Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="absolute inset-0 bg-radial-gradient from-secondary-500/5 via-transparent to-transparent opacity-50" />

        {/* Animated Scanning Line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-secondary-500/20 z-10"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[Shield, Lock, Mail, Search, AlertCircle].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-secondary-500/10"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
            }}
            animate={{
              y: ["-10%", "110%"],
              opacity: [0, 1, 1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear",
            }}
          >
            <Icon size={40 + Math.random() * 60} strokeWidth={1} />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Logo textSize="4xl" width={80} height={80} />
        </motion.div>

        <div className="relative mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative"
          >
            <Text
              font="black"
              className="text-[12rem] md:text-[18rem] leading-none text-transparent bg-clip-text bg-linear-to-b from-secondary-500 to-secondary-900/20 select-none opacity-20"
            >
              404
            </Text>

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  textShadow: [
                    "0 0 20px rgba(187, 255, 20, 0)",
                    "0 0 20px rgba(187, 255, 20, 0.5)",
                    "0 0 20px rgba(187, 255, 20, 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Text
                  font="bold"
                  className="text-6xl md:text-8xl tracking-tighter text-foreground"
                >
                  LOST SIGNAL
                </Text>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Text
            size="2xl"
            font="semiBold"
            className="text-primary mb-4 tracking-[0.2em] uppercase"
          >
            Unencrypted Sector Detected
          </Text>
          <Text
            size="lg"
            color="primary-400"
            className="mb-12 max-w-lg mx-auto leading-relaxed"
          >
            The transmission you&apos;re looking for has been intercepted or
            moved to a more secure location. Verify your credentials and try
            again.
          </Text>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button
                size="lg"
                className=" px-8 py-6 text-lg font-bold transition-all"
              >
                <ChevronLeft className="mr-2" />
                Return to Base
              </Button>
            </Link>

            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-secondary-500/50 text-secondary-500 hover:bg-secondary-500/10 px-8 py-6 text-lg font-bold "
              >
                Contact Security
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Security Status Bar (Bottom) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-8 right-8 flex items-center justify-between text-[10px] uppercase tracking-widest text-primary-500 font-mono"
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-error-500 rounded-full animate-pulse" />
            Connection Status: Severed
          </span>
          <span>Encryption: AES-256</span>
        </div>
        <div className="hidden sm:block">
          Error Log: 0x404_PAGE_NOT_FOUND_SECURE_MAIL_TRANS
        </div>
      </motion.div>
    </main>
  );
};

export default NotFound;
