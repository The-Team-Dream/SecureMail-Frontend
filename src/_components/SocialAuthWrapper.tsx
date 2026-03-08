"use client";
import { useOauth } from "@/APIs/hooks/useAuth";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { SocialAuthButton } from "./SocialAuthButton";
const SocialAuthWrapper = () => {
  const router = useRouter();

  const oauthMutation = useOauth({
    onSuccess: (res) => {
      const token = res?.token;
      if (token) {
        Cookies.set("token", token, { path: "/", expires: 1 });
      }
      toast.success("Signed in successfully");
      router.refresh();
      router.push("/");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Social login failed");
    },
  });

  const handleSocialLogin = (provider: "google" | "outlook") => {
    oauthMutation.mutate({ provider });
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-borderSecondary" />
        <span className="text-center text-borderSecondary">Or</span>
        <div className="flex-1 h-px bg-borderSecondary" />
      </div>

      <div className="grid grid-cols-2 gap-6 md:gap-12">
        <SocialAuthButton
          provider="google"
          title="Google"
          iconSrc="/icons/google.svg"
          isLoading={
            oauthMutation.isPending &&
            oauthMutation.variables?.provider === "google"
          }
          onClick={() => handleSocialLogin("google")}
        />
        <SocialAuthButton
          provider="outlook"
          title="Outlook"
          iconSrc="/icons/outlook.svg"
          isLoading={
            oauthMutation.isPending &&
            oauthMutation.variables?.provider === "outlook"
          }
          onClick={() => handleSocialLogin("outlook")}
        />
      </div>
    </div>
  );
};

export default SocialAuthWrapper;
