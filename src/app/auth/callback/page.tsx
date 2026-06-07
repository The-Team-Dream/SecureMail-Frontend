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

    const finish = () => {
      setTimeout(() => {
        window.close();
      }, 100);
    };

    if (token) {
      Cookies.set("token", token, { path: "/", expires: 1 });

      try {
        const channel = new BroadcastChannel("oauth_channel");
        channel.postMessage({ type: "OAUTH_SUCCESS", token });
        channel.close();
      } catch (e) {
        console.error("BroadcastChannel failed", e);
      }

      if (window.opener) {
        window.opener.postMessage(
          { type: "OAUTH_SUCCESS", token },
          window.location.origin,
        );
      }

      finish();

      setTimeout(() => {
        toast.success("Logged in successfully", { id: "oauth-login" });
        router.push("/mailboxes");
      }, 500);
    } else if (code) {
      if (window.opener) {
        window.opener.postMessage(
          { type: "OAUTH_CODE_RECEIVED", code },
          window.location.origin,
        );
      }
      finish();
    } else {
      if (!window.opener) {
        toast.error("Authentication failed. No token or code received.");
        router.push("/sign-in");
      } else {
        finish();
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
