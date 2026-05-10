"use client";

import { useState, use, useMemo } from "react";
import Container from "@/_components/shared/Container";
import { Text } from "@/_components/shared/Text";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
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
      {/* ── Header ────────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <Text as="h1" size="2xl" font="bold">
          Security Reports
        </Text>
      </motion.div>

      {/* ── Stats Grid ────────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={itemVariants} className="h-full">
          <StatCard
            title="Total"
            value={stats.total}
            description="Overall security logs"
            icon={Icons.Reports}
            type="neutral"
          />
        </motion.div>
        <motion.div variants={itemVariants} className="h-full">
          <StatCard
            title="Phishing"
            value={stats.phishing}
            description="Identity theft attempts"
            icon={Icons.Phishing}
            type="warning"
          />
        </motion.div>
        <motion.div variants={itemVariants} className="h-full">
          <StatCard
            title="Spam"
            value={stats.spam}
            description="Junk & unwanted mail"
            icon={Icons.Spam}
            type="info"
          />
        </motion.div>
        <motion.div variants={itemVariants} className="h-full">
          <StatCard
            title="Malware"
            value={stats.malware}
            description="Malicious software detected"
            icon={Icons.Malware}
            type="error"
          />
        </motion.div>
      </motion.div>

      {/* ── Search Bar ────────────────────────────────────────────── */}
      <div className="relative mb-6">
        <Input
          placeholder="Search reports..."
          leftIcon={<Search className="text-primary-600 w-5 h-5" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ── Reports List ───────────────────────────────────────────── */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <StateMessage
            image={notFoundImg}
            title="No Threats Found"
            description="Your mailbox is currently safe. No security threats have been detected in the processed emails."
          />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3"
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
