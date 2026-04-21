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
      <div className="flex flex-col items-center max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
        <div className="relative mb-8 mt-12">
          <div className="absolute -top-4 -left-8 w-2 h-2 rounded-full bg-blue-500" />
          <div className="absolute top-0 -right-6 w-3 h-3 rounded-sm bg-yellow-400 rotate-12" />
          <div className="absolute bottom-2 -left-6 w-3 h-1 bg-red-400 -rotate-45" />
          <div className="absolute -bottom-4 right-0 w-2 h-2 rounded-full bg-blue-400" />
          <div className="absolute top-10 -right-10 w-2 h-2 rounded-full bg-green-400" />
          <div className="w-24 h-24 bg-secondary-600 rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-12 h-12 text-white stroke-[3px]" />
          </div>
        </div>
        <Text as="h2" size="2xl" font="medium" className="text-center mb-2 text-primary-900">Account added successfully</Text>
        <Text size="sm" className="text-primary-400 text-center mb-8 max-w-sm leading-relaxed px-4">
          your account added successfully to SecureMail. Start getting mails securely.
        </Text>
        <Button
          className="w-full max-w-[320px] h-12 bg-primary-900 text-primary-50 hover:bg-primary-800 rounded-xl mb-6"
          onClick={resetWizard}
        >
          Add New Account
        </Button>
        <button
          onClick={onCancel}
          className="text-sm font-medium text-primary-900 hover:text-primary-600 transition-colors inline-flex items-center gap-1 underline"
        >
          View My accounts <ChevronRight className="w-4 h-4 text-black-500" />
        </button>
      </div>
    </div>
  );
}
