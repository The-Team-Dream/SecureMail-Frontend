"use client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  isLoading: boolean;
  className?: string;
  barClassName?: string;
}

export const ProgressBar = ({
  isLoading,
  className,
  barClassName,
}: ProgressBarProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "100%" }}
          exit={{ opacity: 0, height: 0 }}
          className={cn("w-full relative overflow-hidden", className)}
        >
          {/* Infinite Moving Bar */}
          <motion.div
            className={cn(
              "h-full w-[40%] absolute",
              !barClassName &&
                "bg-linear-to-r from-primary-600 via-primary-500 to-primary-700",
              barClassName,
            )}
            initial={{ left: "-40%" }}
            animate={{ left: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
              }}
              animate={{
                backgroundPosition: ["200% 0", "-200% 0"],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Glowing Edge */}
            <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-background shadow-[0_0_15px_rgba(var(--primary-rgb),0.8),0_0_25px_rgba(var(--primary-rgb),0.5)]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
