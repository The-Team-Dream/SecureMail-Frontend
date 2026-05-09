"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Text } from "@/_components/shared/Text";

interface BackEndErrorProps {
  error?: string;
}

const BackEndError = ({ error }: BackEndErrorProps) => {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          key="backend-error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-error-500 shrink-0" />
            <Text
              size="sm"
              color="error"
              font="medium"
              className="leading-tight"
            >
              {error}
            </Text>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackEndError;
