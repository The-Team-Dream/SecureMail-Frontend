"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Container from "@/_components/shared/Container";
import { Text } from "@/_components/shared/Text";
import { stats, listItems } from "./data";
import { ReportsPageSkeleton } from "@/_components/skeleton/ReportsPageSkeleton";
import { StateMessage } from "@/_components/shared/StateMessage";
import { useMailboxes } from "@/APIs/hooks/mailboxes";
import { useGetAuthMe } from "@/APIs/hooks/auth";
import { getFirstName } from "@/lib/utils";

const ReportStatCard = dynamic(() =>
  import("./ReportStatCard").then((mod) => mod.ReportStatCard),
);
const ReportListItem = dynamic(() =>
  import("./ReportListItem").then((mod) => mod.ReportListItem),
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

import notFoundImg from "@/../public/images/not-found.png";

export default function Reports() {
  const {
    data: reports,
    isLoading: reportsLoading,
    isError: reportsIsError,
    refetch: reportsRefetch,
  } = useMailboxes();
  const {
    data: user,
    isLoading: userIsLoading,
    isError: userIsError,
  } = useGetAuthMe();

  if (userIsLoading || reportsLoading) return <ReportsPageSkeleton />;

  if (userIsError || reportsIsError) {
    return (
      <Container>
        <StateMessage
          variant="error"
          image={notFoundImg}
          title="Security Insights Unavailable"
          description="We're currently unable to load your security reports. Please check your network connection or try syncing your mailboxes again."
          onRetry={reportsRefetch}
          actionText="Try Again"
        />
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Text size={"2xl"} font={"bold"}>
            Good Morning, {getFirstName(user?.user?.username) || "User"}
          </Text>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {useMemo(
            () =>
              stats.map(({ id, ...props }) => (
                <ReportStatCard key={id} {...props} />
              )),
            [],
          )}
        </motion.div>

        {/* List Items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4 mt-2"
        >
          {useMemo(
            () =>
              listItems.map(({ id, ...props }) => (
                <ReportListItem key={id} {...props} />
              )),
            [],
          )}
        </motion.div>
      </div>
    </Container>
  );
}
