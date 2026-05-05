"use client";

import { motion } from "framer-motion";
import React from "react";

export default function AuthTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300,
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
