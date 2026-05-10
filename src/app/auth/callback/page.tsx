"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/_components/shared/Text";
import { toast } from "sonner";

export default function OAuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const code = searchParams.get("code");

    if (window.opener) {
      if (token) {
        window.opener.postMessage({ type: "OAUTH_SUCCESS", token }, "*");
        window.close();
      } else if (code) {
        window.opener.postMessage({ type: "OAUTH_CODE_RECEIVED", code }, "*");
        window.close();
      } else {
        window.close();
      }
    } else if (token) {
      // If opened in the same window, handle redirect normally
      Cookies.set("token", token, { path: "/", expires: 1 });
      toast.success("Logged in successfully");
      router.push("/mailboxes");
    } else if (!window.opener) {
      toast.error("Authentication failed. No token or code received.");
      router.push("/sign-in");
    }
  }, [searchParams, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <Spinner />
      <Text font="medium" color="primary-950">
        Completing authentication...
      </Text>
    </div>
  );
}
