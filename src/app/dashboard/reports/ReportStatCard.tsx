"use client";
import { motion } from "framer-motion";
import type { Stat } from "./data";

type ReportStatCardProps = Omit<Stat, "id">;

export function ReportStatCard({ label, value, badgeClass, badgeText }: ReportStatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-2xl p-6 flex flex-col gap-3 bg-ghostBlue transition-shadow hover:shadow-md"
    >
      <span className="text-sm font-medium text-primary-500">{label}</span>
      <div className="text-4xl font-bold text-primary-950">{value}</div>
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold w-fit ${badgeClass}`}>
        {badgeText}
      </span>
    </motion.div>
  );
}
