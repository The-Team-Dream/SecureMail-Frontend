import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ListItem } from "./data";
import { Text } from "@/_components/shared/Text";

type ReportListItemProps = Omit<ListItem, "id">;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100 },
  },
};

export function ReportListItem({
  badgeClass,
  badge,
  time,
  title,
  description,
  meta,
}: ReportListItemProps) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ x: 5 }}
      className="rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-ghostBlue border border-transparent hover:border-primary-100 transition-all duration-300"
    >
      <div className="flex flex-col gap-3">
        {/* Badge + Time */}
        <div className="flex items-center gap-2">
          <Text
            as={"span"}
            font={"bold"}
            className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] tracking-wide uppercase ${badgeClass}`}
          >
            {badge}
          </Text>
          <Text as={"span"} size={"xs"} color={"primary-500"} font={"medium"}>
            {time}
          </Text>
        </div>

        {/* Title + Description */}
        <div className="flex flex-col gap-2">
          <Text as={"h3"} font={"bold"} color={"primary-950"}>
            {title}
          </Text>
          <Text as={"p"} size={"xs"} color={"primary-500"} font={"light"}>
            {description}
          </Text>
        </div>

        {/* Meta (avatars / location / status) */}
        {meta}
      </div>
    </motion.div>
  );
}
