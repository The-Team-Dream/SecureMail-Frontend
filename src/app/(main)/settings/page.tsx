"use client";
import Container from "@/_components/shared/Container";
import { Text } from "@/_components/shared/Text";
import { Trash2, ArrowRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/APIs/hooks/useAuth";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import PersonalInfo from "./_components/PersonalInfo";
import Security from "./_components/Security";
import Preference from "./_components/Preference";
import SessionManagement from "./_components/SessionManagement";

const Settings = () => {
  const router = useRouter();
  const { mutate, isPending } = useLogout({
    onSuccess: (res) => {
      toast.success(res.data.message || "Logout successfully");
      Cookies.remove("token");
      router.replace("/sign-in");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data.message || "Logout failed");
    },
  });
  return (
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
            className="group-hover:text-white"
          >
            Clear
          </Text>{" "}
          <Trash2 className="w-4 h-4 text-error-500 group-hover:text-white" />
        </Button>
      </div>
      <Button
        className="w-fit px-6 py-2  mt-4 bg-error-500 hover:bg-error-600 "
        disabled={isPending}
        onClick={() => mutate()}
        size={"sm"}
      >
        <LogOut className="w-4 h-4" />
        Log out
      </Button>
    </Container>
  );
};

export default Settings;
