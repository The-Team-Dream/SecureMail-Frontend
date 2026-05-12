"use client";

import { useState, use, useMemo } from "react";
import Container from "@/_components/shared/Container";
import { Text } from "@/_components/shared/Text";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldAlert, ShieldCheck, Zap } from "lucide-react";
import { Icons } from "@/constants/icons";
import { useMailboxReports } from "@/APIs/hooks/mailboxes";
import { StateMessage } from "@/_components/shared/StateMessage";
import { Input } from "@/_components/shared/Input";
import { SecurityReport } from "@/APIs/types/Reports";
import { ReportsSkeleton } from "@/_components/skeleton/ReportsSkeleton";
import { StatCard } from "./_components/StatCard";
import { ReportCard } from "./_components/ReportCard";
import { containerVariants, itemVariants } from "./_components/variants";
import notFoundImg from "../../../../../../public/images/not-found.png";
import { Badge } from "@/components/ui/badge";
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

  const reports: SecurityReport[] = useMemo(() => {
    return (data as any)?.data?.data || (data as any)?.data || [];
  }, [data]);

  const filteredReports = useMemo(() => {
    return reports.filter(
      (report) =>
        report.subject
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim()) ||
        report.from.toLowerCase().includes(searchTerm.toLowerCase().trim()),
    );
  }, [reports, searchTerm]);

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
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 mt-4"
      >
        <Text as="h1" size="2xl" font="bold">
          Security Reports
        </Text>

        <div className="flex items-center gap-3 bg-ghostBlue/50 p-1.5 rounded-2xl border border-primary-100/50">
          <div className="px-4 py-2 bg-background rounded-xl shadow-xs border border-primary-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
              <Text size="xs" font="bold" className="uppercase tracking-wider">
                Live System
              </Text>
            </div>
          </div>
          <Text
            size="xs"
            font="bold"
            className="px-3 opacity-40 uppercase tracking-widest"
          >
            v1.4.2
          </Text>
        </div>
      </motion.div>

      {/* ── Hero Overview Section ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        {/* Main Score Widget */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-5 bg-linear-to-br from-primary-950 via-primary-900 to-primary-950 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-500/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 rounded-2xl bg-background/5 border border-background/10 backdrop-blur-md">
                <ShieldCheck className="text-primary-400 w-6 h-6" />
              </div>
              <Badge className="bg-success-500/20 text-success-400 border-success-500/30 font-black px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">
                Encrypted
              </Badge>
            </div>

            <div className="flex-1 flex flex-col justify-center py-4">
              <Text
                font="black"
                className="text-primary-400 uppercase tracking-[0.2em] text-[10px] mb-2 block"
              >
                Global Health Score
              </Text>
              <div className="flex items-end gap-3 mb-4">
                <Text
                  size="5xl"
                  font="black"
                  className="text-background leading-none tracking-tighter"
                >
                  {stats.score}%
                </Text>
                <div className="flex flex-col mb-1">
                  <div className="flex items-center gap-1 text-success-400">
                    <Zap size={14} fill="currentColor" />
                    <Text size="xs" font="bold">
                      +2.4%
                    </Text>
                  </div>
                  <Text
                    size="xs"
                    className="text-primary-500 font-bold uppercase tracking-tighter"
                  >
                    vs Last Week
                  </Text>
                </div>
              </div>

              <div className="w-full h-3 bg-background/5 rounded-full overflow-hidden p-0.5 border border-background/5 shadow-inner mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.score}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-linear-to-r from-primary-400 to-secondary-400 rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                />
              </div>

              <Text
                size="sm"
                className="text-primary-100/70 leading-relaxed max-w-[280px]"
              >
                Your security profile is currently{" "}
                <span className="text-background font-bold">
                  {stats.score > 80 ? "Excellent" : "Stable"}
                </span>
                . Heuristic filters are performing at peak efficiency.
              </Text>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid Right */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
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
      </div>

      {/* ── Control Bar ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col md:flex-row items-center gap-4 mb-8"
      >
        <div className="relative w-full flex-1 group">
          <Input
            placeholder="Search security reports by subject or sender..."
            className="pl-12 h-14 rounded-2xl border-primary-100/60 bg-background shadow-xs focus:shadow-lg transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 w-5 h-5 transition-colors group-focus-within:text-primary-600" />
        </div>

        <div className="flex items-center gap-2 bg-ghostBlue/50 p-1 rounded-2xl border border-primary-100/50 shrink-0">
          {["All", "Alerts", "Safe"].map((tab) => (
            <button
              key={tab}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300",
                tab === "All"
                  ? "bg-background shadow-md text-primary-950"
                  : "text-primary-400 hover:text-primary-600",
              )}
            >
              {tab}
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
              image={notFoundImg}
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
