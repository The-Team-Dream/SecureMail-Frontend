"use client";
import { lazy, Suspense } from "react";
import Container from "@/_components/shared/Container";
import { Text } from "@/_components/shared/Text";
import { Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/APIs/hooks/auth";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-load heavy accordion sections to improve initial LCP
const PersonalInfo = lazy(() => import("./_components/PersonalInfo"));
const Security = lazy(() => import("./_components/Security"));
const Preference = lazy(() => import("./_components/Preference"));
const SessionManagement = lazy(() => import("./_components/SessionManagement"));

const SectionFallback = () => (
  <div className="space-y-3 py-4 w-full">
    <Skeleton className="h-7 w-48 bg-primary-100" />
    <Skeleton className="h-[76px] w-full bg-primary-50 rounded-xl" />
  </div>
);

const SettingsFallback = () => (
  <Container>
    <div className="flex flex-col w-full">
      <SectionFallback />
      <hr className="bg-primary-100" />
      <SectionFallback />
      <hr className="bg-primary-100" />
      <SectionFallback />
      <hr className="bg-primary-100" />
      <SectionFallback />
      <hr className="bg-primary-100" />
      <div className="flex items-center justify-between mt-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-32 bg-primary-100" />
          <Skeleton className="h-4 w-48 bg-primary-50" />
        </div>
        <Skeleton className="h-9 w-24 bg-primary-100 rounded-md" />
      </div>
      <Skeleton className="h-9 w-28 bg-primary-100 rounded-md mt-4" />
    </div>
  </Container>
);

const Settings = () => {
  const router = useRouter();
  const { mutate, isPending } = useLogout({
    onSuccess: () => {
      toast.success("Logout successfully");
      Cookies.remove("token");
      router.replace("/sign-in");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Logout failed");
    },
  });

  return (
    <Suspense fallback={<SettingsFallback />}>
      <Container>
        <PersonalInfo />
        <hr className="bg-primary-100" />
        <Security />
        <hr className="bg-primary-100" />
        <SessionManagement />
        <hr className="bg-primary-100" />
        <Preference />
        <hr className="bg-primary-100" />
        <div className="flex items-center justify-between mt-6">
          <div className="flex flex-col gap-2">
            <Text color={"primary-950"} size={"2xl"} font={"medium"}>
              Clear cache
            </Text>
            <Text color={"primary-500"} size={"sm"}>
              124 MB of temporary data
            </Text>
          </div>
          <Button
            size={"sm"}
            variant={"ghost"}
            className="border border-error-500 hover:bg-error-500 group"
          >
            <Text
              color={"error-500"}
              size={"sm"}
              className="group-hover:text-background"
            >
              Clear
            </Text>{" "}
            <Trash2 className="w-4 h-4 text-error-500 group-hover:text-background" />
          </Button>
        </div>
      </Container>
    </Suspense>
  );
};

export default Settings;
