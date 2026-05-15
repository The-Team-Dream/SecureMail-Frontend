"use client";
import { useGetAuthMe } from "@/APIs/hooks/auth";
import { useAnalyticsOverview } from "@/APIs/hooks/analytics";
import { useSessions } from "@/APIs/hooks/sessions";
import { useNotifications } from "@/APIs/hooks/notifications";
import { useMemo } from "react";

import Container from "@/_components/shared/Container";
import { Text } from "@/_components/shared/Text";
import { ProfileHeader } from "./ProfileHeader";
import { UsageStats } from "./UsageStats";
import { StatsSkeleton } from "@/_components/skeleton/StatsSkeleton";
import { StateMessage } from "@/_components/shared/StateMessage";
import errorImg from "../../../../../public/images/not-found.png";
import { motion } from "framer-motion";

const ProfileClient = () => {
  const { data: userData, isLoading: isUserLoading, isError: isUserError } = useGetAuthMe();
  const { data: overviewData, isLoading: isOverviewLoading } = useAnalyticsOverview();

  const user = userData?.user;

  // Unwrapping data
  const finalOverview = useMemo(() => {
    const data = (overviewData as any)?.data?.data || (overviewData as any)?.data || overviewData;
    return data;
  }, [overviewData]);

  const isLoading = isUserLoading || isOverviewLoading;

  if (isLoading) {
    return (
      <Container className="py-10">
        <StatsSkeleton />
      </Container>
    );
  }

  if (isUserError || !user) {
    return (
      <Container>
        <StateMessage
          variant="error"
          image={errorImg}
          title="Profile Unavailable"
          description="We encountered an issue while loading your profile data. Please try refreshing the page."
          actionText="Refresh Page"
          onRetry={() => window.location.reload()}
        />
      </Container>
    );
  }

  return (
    <Container className="py-8 md:py-12 flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Header */}
      <ProfileHeader user={user} />

      {/* Main Stats */}
      <div className="grid grid-cols-1 gap-8">
        <UsageStats 
          totalMailboxes={finalOverview?.totalMailboxesConnected || 0}
          storageUsed={finalOverview?.totalStorageUsed || 0}
          totalThreats={(finalOverview?.totalPhishingDetected || 0) + (finalOverview?.totalSpamDetected || 0)}
        />
      </div>
    </Container>
  );
};

export default ProfileClient;
