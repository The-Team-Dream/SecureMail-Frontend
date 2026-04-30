"use client";
import { motion } from "framer-motion";
import type { Stat } from "./data";
import { Text } from "@/_components/shared/Text";

type ReportStatCardProps = Omit<Stat, "id">;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100 },
  },
};

export function ReportStatCard({ label, value, badgeClass, badgeText }: ReportStatCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="rounded-2xl p-6 flex flex-col gap-3 bg-ghostBlue transition-shadow hover:shadow-md"
    >
      <Text as={'span'} size={'sm'} color={'primary-500'} font={'medium'}>{label}</Text>
      <Text as={'h1'} font={'bold'} size={'3xl'}>{value}</Text>
      <Text size={'sm'} font={'semiBold'} className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-light w-fit ${badgeClass}`}>
        {badgeText}
      </Text>
    </motion.div>
  );
}
