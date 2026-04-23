import React from "react";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight } from "lucide-react";

interface StepSuccessProps {
  onCancel: () => void;
  resetWizard: () => void;
}

export function StepSuccess({ onCancel, resetWizard }: StepSuccessProps) {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-card items-center justify-center p-8">
      <div className="flex flex-col items-center max-w-[540px] w-full animate-in fade-in zoom-in-95 duration-500">

        {/* Checkmark Icon */}
        <div className="relative mb-10">
          {/* Decorative confetti dots */}
          <div className="absolute -top-3 -left-8 w-2 h-2 rounded-full bg-blue-400 opacity-80" />
          <div className="absolute -top-1 -right-7 w-2.5 h-2.5 rounded-sm bg-yellow-400 rotate-12 opacity-90" />
          <div className="absolute bottom-3 -left-7 w-3 h-1 bg-red-400 -rotate-45 opacity-80 rounded" />
          <div className="absolute -bottom-3 right-1 w-2 h-2 rounded-full bg-blue-300 opacity-70" />
          <div className="absolute top-8 -right-9 w-2 h-2 rounded-full bg-[#87BE00] opacity-60" />
          <div className="absolute -top-5 left-4 w-1.5 h-1.5 rounded-full bg-purple-400 opacity-70" />

          {/* Main circle */}
          <div className="w-[100px] h-[100px] rounded-full bg-[#87BE00] flex items-center justify-center shadow-[0_8px_32px_-4px_rgba(135,190,0,0.45)]">
            <Check className="w-12 h-12 text-white stroke-[3px]" />
          </div>
        </div>

        {/* Title */}
        <Text as="h2" size="3xl" font="normal" className="text-center mb-3 text-primary-900 tracking-tight">
          Account added successfully
        </Text>

        {/* Subtitle */}
        <Text size="sm" className="text-primary-400 text-center mb-10 max-w-[420px] leading-normal">
          your account added successfully to SecureMail.<br />
          Start getting mails securely.
        </Text>

        {/* Add New Account Button */}
        <Button
          className="w-full h-[53px] bg-black text-white hover:bg-gray-900 rounded-[12px] mb-5 font-medium text-base transition-all shadow-md"
          onClick={resetWizard}
        >
          Add New Account
        </Button>

        {/* View My Accounts Link */}
        <button
          onClick={onCancel}
          className="text-sm font-medium text-primary-900 hover:text-primary-600 transition-colors inline-flex items-center gap-1 underline underline-offset-2"
        >
          View My accounts <ChevronRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
