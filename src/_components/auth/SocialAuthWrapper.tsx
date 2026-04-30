"use client";

import { SocialAuthButton } from "./SocialAuthButton";

const SocialAuthWrapper = () => {

  const handleOAuthClick = (provider: "google" | "outlook") => {
    // test
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-primary-200 rounded-xs" />
        <span className="text-center text-primary-500">Or</span>
        <div className="flex-1 h-px bg-primary-200 rounded-xs" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-12">
        <SocialAuthButton
          provider="google"
          title="Google"
          iconSrc="/icons/google.svg"
          onClick={() => handleOAuthClick("google")}
          // isLoading={oauthLoginMutation.isPending}
        />
      </div>
    </div>
  );
};

export default SocialAuthWrapper;
