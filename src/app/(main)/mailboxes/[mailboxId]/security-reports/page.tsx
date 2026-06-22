"use client";

import { useState, use, useMemo } from "react";
import Container from "@/_components/shared/Container";
import { Text } from "@/_components/shared/Text";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldCheck } from "lucide-react";
import { Icons } from "@/constants/icons";
import { useMailboxReports } from "@/APIs/hooks/mailboxes";
import { StateMessage } from "@/_components/shared/StateMessage";
import { Input } from "@/_components/shared/Input";
import { SecurityReport } from "@/APIs/types/Report";
import { ReportsSkeleton } from "@/_components/skeleton/ReportsSkeleton";
import { StatCard } from "./_components/StatCard";
import { ReportCard } from "./_components/ReportCard";
import { containerVariants, itemVariants } from "./_components/variants";
import notFoundImg from "@/../public/images/not-found.png";
import { cn } from "@/lib/utils";

export default function SecurityReportsPage({
  params,
}: {
  params: Promise<{ mailboxId: string }>;
}) {
  const { mailboxId } = use(params);
  const { data, isLoading, isError, refetch } = useMailboxReports(mailboxId);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "phishing" | "spam" | "malware">("all");

  const reports: SecurityReport[] = useMemo(() => {
    return (data as any)?.data?.data || (data as any)?.data || [];
  }, [data]);


  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // 1. Search term filter
      const matchesSearch =
        report.subject.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        report.from.toLowerCase().includes(searchTerm.toLowerCase().trim());

      // 2. Classification filter
      const matchesTab =
        activeTab === "all" ||
        report.classification?.toLowerCase() === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [reports, searchTerm, activeTab]);

  const stats = useMemo(
    () => ({
      total: reports.length,
      phishing: reports.filter((r) => r.classification === "phishing").length,
      spam: reports.filter((r) => r.classification === "spam").length,
      malware: reports.filter((r) => r.classification === "malware").length,
      // Calculate a security score (0-100)
      score: Math.max(
        0,
        100 - reports.filter((r) => r.classification !== "clean").length * 5,
      ),
    }),
    [reports],
  );

  if (isLoading) return <ReportsSkeleton />;

  if (isError) {
    return (
      <Container>
        <StateMessage
          variant="error"
          image={notFoundImg}
          title="Security Reports Offline"
          description="We're having trouble fetching the security report data for this mailbox. Please ensure the account is active and try again."
          onRetry={refetch}
          actionText="Try Again"
        />
      </Container>
    );
  }

  return (
    <Container>
      {/* ── Page Header ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Text as="h1" size="2xl" font="bold" className="mb-6">
          Security Reports
        </Text>
      </motion.div>

      {/* ── Hero Overview Section ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <StatCard
          title="Total Logs"
          value={stats.total}
          description="Continuous events monitored"
          icon={Icons.Reports}
          type="neutral"
        />
        <StatCard
          title="Phishing Alerts"
          value={stats.phishing}
          description="Identity theft prevented"
          icon={Icons.Phishing}
          type="warning"
        />
        <StatCard
          title="Spam Intercepted"
          value={stats.spam}
          description="Automated junk filtering"
          icon={Icons.Spam}
          type="info"
        />
        <StatCard
          title="Malware Blocked"
          value={stats.malware}
          description="Malicious payloads neutralized"
          icon={Icons.Malware}
          type="error"
        />
      </div>

      {/* ── Control Bar ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col md:flex-row items-center gap-4 mb-8"
      >
        <Input
          leftIcon={<Search className="w-6 h-6" />}
          placeholder="Search security reports by subject or sender..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex items-center gap-2 bg-ghostBlue/50 p-1 rounded-2xl border border-primary-100/50 shrink-0">
          {[
            { id: "all", label: "All" },
            { id: "phishing", label: "Phishing" },
            { id: "spam", label: "Spam" },
            { id: "malware", label: "Malware" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer",
                activeTab === tab.id
                  ? "bg-background shadow-md text-primary-950"
                  : "text-primary-400 hover:text-primary-600",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Reports List ───────────────────────────────────────────── */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <StateMessage
              variant="empty"
              icon={ShieldCheck}
              title="No Threats Found"
              description="Your mailbox is currently safe. No security threats have been detected in the processed emails."
              className="py-20 bg-ghostBlue/20 rounded-[2.5rem] border border-dashed border-primary-100"
            />
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredReports.map((report) => (
                <motion.div
                  key={report.id}
                  layout
                  variants={itemVariants}
                  exit="exit"
                >
                  <ReportCard
                    report={report}
                    isExpanded={expandedId === report.id}
                    onToggle={() =>
                      setExpandedId(expandedId === report.id ? null : report.id)
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </Container>
  );
}
