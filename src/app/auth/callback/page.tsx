"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/_components/shared/Text";
import toast from "react-hot-toast";

export default function OAuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      if (window.opener) {
        // If opened as a popup, send the token to the parent window
        window.opener.postMessage({ type: "OAUTH_SUCCESS", token }, "*");
        window.close();
      } else {
        // If opened in the same window, handle redirect normally
        Cookies.set("token", token, { path: "/", expires: 1 });
        toast.success("Logged in successfully");
        router.push("/mailboxes");
      }
    } else {
      if (window.opener) {
        window.close();
      } else {
        toast.error("Authentication failed. No token received.");
        router.push("/sign-in");
      }
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
