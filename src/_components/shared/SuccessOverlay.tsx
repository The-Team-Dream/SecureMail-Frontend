"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Text } from "@/_components/shared/Text";

interface SuccessOverlayProps {
  isSuccess: boolean;
}

const confettiVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.7 + i * 0.1,
      type: "spring",
      stiffness: 200,
    },
  }),
};

const SuccessOverlay = ({ isSuccess }: SuccessOverlayProps) => {
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push("/sign-in");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  return (
    <Dialog open={isSuccess}>
      <DialogPortal>
        <DialogOverlay className="bg-transparent pointer-events-none" />

        <DialogContent
          className="border-none bg-transparent shadow-none pointer-events-none focus:ring-0 p-0 [&>button]:hidden"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogTitle className="sr-only">Verification Successful</DialogTitle>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.5,
            }}
            className="flex flex-col items-center max-w-[540px] w-full p-12 bg-card rounded-[40px] shadow-2xl border border-primary-100/20 pointer-events-auto"
          >
            {/* Checkmark Icon Container */}
            <div className="relative mb-10 flex items-center justify-center">
              {/* Decorative confetti dots - Animated (Copied from StepSuccess) */}
              <motion.div
                custom={1}
                variants={confettiVariants}
                initial="initial"
                animate="animate"
                className="absolute -top-3 -left-8 w-2 h-2 rounded-full bg-blue-400"
              />
              <motion.div
                custom={2}
                variants={confettiVariants}
                initial="initial"
                animate="animate"
                className="absolute -top-1 -right-7 w-2.5 h-2.5 rounded-sm bg-yellow-400 rotate-12"
              />
              <motion.div
                custom={3}
                variants={confettiVariants}
                initial="initial"
                animate="animate"
                className="absolute bottom-3 -left-7 w-3 h-1 bg-red-400 -rotate-45 rounded"
              />
              <motion.div
                custom={4}
                variants={confettiVariants}
                initial="initial"
                animate="animate"
                className="absolute -bottom-3 right-1 w-2 h-2 rounded-full bg-blue-300"
              />
              <motion.div
                custom={5}
                variants={confettiVariants}
                initial="initial"
                animate="animate"
                className="absolute top-8 -right-9 w-2 h-2 rounded-full bg-[#87BE00]"
              />
              <motion.div
                custom={6}
                variants={confettiVariants}
                initial="initial"
                animate="animate"
                className="absolute -top-5 left-4 w-1.5 h-1.5 rounded-full bg-purple-400"
              />

              <div className="relative w-[100px] h-[100px]">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full drop-shadow-[0_8px_16px_rgba(135,190,0,0.4)]"
                >
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="#87BE00"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1,
                    }}
                  />
                  <motion.path
                    d="M30 52L43 65L70 38"
                    fill="transparent"
                    stroke="white"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  />
                </svg>
              </div>
            </div>

            <div className="text-center">
              <Text
                as="h2"
                size="3xl"
                font="normal"
                color={"primary-900"}
                className="mb-3"
              >
                Verified Successfully!
              </Text>

              <Text
                size="sm"
                color={"primary-500"}
                className="mb-10 max-w-[420px] leading-relaxed"
              >
                Your account has been verified successfully.
                <br />
                Redirecting you to login to start using SecureMail.
              </Text>
            </div>

            {/* Subtle loading indicator or progress line could go here if needed, 
                but keeping it clean as per StepSuccess style */}
            <div className="flex items-center gap-2 text-primary font-medium animate-pulse">
              <Text size="sm">Redirecting...</Text>
            </div>
          </motion.div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default SuccessOverlay;
