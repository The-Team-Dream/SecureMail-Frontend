import { ArrowRight } from "lucide-react";
import type { ListItem } from "./data";

type ReportListItemProps = Omit<ListItem, "id">;

export function ReportListItem({ badgeClass, badge, time, title, description, meta, buttonLabel }: ReportListItemProps) {
  return (
    <div className="rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-ghostBlue border border-ghostBlue">
      <div className="flex flex-col gap-3">
        {/* Badge + Time */}
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${badgeClass}`}>
            {badge}
          </span>
          <span className="text-xs text-primary-400 font-medium">{time}</span>
        </div>

        {/* Title + Description */}
        <div>
          <h3 className="text-base font-bold text-primary-950">{title}</h3>
          <p className="text-sm text-primary-500 mt-1">{description}</p>
        </div>

        {/* Meta (avatars / location / status) */}
        {meta}
      </div>

      {/* Action Button */}
      <button className="flex items-center gap-1.5 text-sm font-medium text-primary-950 hover:text-primary-700 transition-colors whitespace-nowrap">
        {buttonLabel} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
