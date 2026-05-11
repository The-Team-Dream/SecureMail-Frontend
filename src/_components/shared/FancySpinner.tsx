"use client";
import { motion } from "framer-motion";
import { Text } from "@/_components/shared/Text";

interface FancySpinnerProps {
  text?: string;
}

export function FancySpinner({ text = "Loading..." }: FancySpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-80px)] bg-card">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-[3px] border-primary-100" />
        <motion.div
          className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent border-r-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-[3px] border-secondary-500 border-b-transparent border-l-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Text className="mt-6" font="medium" color="primary-500">
          {text}
        </Text>
      </motion.div>
    </div>
  );
}
