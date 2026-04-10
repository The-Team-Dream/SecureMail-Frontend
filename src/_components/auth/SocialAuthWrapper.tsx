"use client";

import { SocialAuthButton } from "./SocialAuthButton";
const SocialAuthWrapper = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-primary-500 rounded-xs" />
        <span className="text-center text-primary-500">Or</span>
        <div className="flex-1 h-px bg-primary-500 rounded-xs" />
      </div>

      <div className="grid grid-cols-2 gap-6 md:gap-12">
        <SocialAuthButton
          provider="google"
          title="Google"
          iconSrc="/icons/google.svg"
          onClick={() => console.log("google clicked")}
        />
        <SocialAuthButton
          provider="outlook"
          title="Outlook"
          iconSrc="/icons/outlook.svg"
          onClick={() => console.log("outlook clicked")}
        />
      </div>
    </div>
  );
};

export default SocialAuthWrapper;
