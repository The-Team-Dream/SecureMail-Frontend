"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMailStore } from "@/stores/useMailStore";
import { Text } from "../shared/Text";
import { useRouter } from "next/navigation";

export const MailDetails = ({ emailId }: { emailId: string }) => {
  const router = useRouter();
  const emails = useMailStore((s) => s.emails);

  const email = emails.find((e) => e.id === emailId);

  if (!email) return null;

  return (
    <div className="flex flex-col h-full bg-background p-4 sm:p-8 animate-in fade-in duration-300">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 text-primary-500 hover:text-primary-800 p-0 hover:bg-transparent"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inbox
        </Button>
        <Text size="2xl" font="semiBold" className="text-primary-950">
          {email.subject}
        </Text>
      </div>

      <div className="flex items-center gap-4 mb-8">
        {/* Avatar Placeholder */}
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
          {/* We use a simple initial as avatar since we don't have images */}
          <Text size="lg" font="bold" className="text-primary-600 uppercase">
            {email.sender.charAt(0)}
          </Text>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Text font="medium" className="text-primary-950">
              {email.sender}
            </Text>
            <Text size="sm" className="text-primary-400">
              &lt;{email.senderEmail}&gt;
            </Text>
          </div>
          <Text size="sm" className="text-primary-400">
            to me
          </Text>
        </div>
      </div>

      <div className="flex-1 border-l-[3px] border-dotted border-[#0066FF] pl-6 ml-6">
        <div className="text-primary-800 space-y-6 text-[15px] leading-relaxed">
          <p>Dear Mohamed,</p>
          <p>{email.bodyText}</p>
          <p>Best Regards,</p>

          {/* Signature Block */}
          <div className="mt-12 pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#002B5B] rounded-sm flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-t-4 border-b-4 border-l-4 border-[#E31837] rounded-l-md transform -skew-x-12"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-6 h-6 border-b-4 border-[#0066FF] transform skew-x-12"></div>
                </div>
              </div>
            </div>
            <Text size="xs" font="bold" className="text-[#002B5B] tracking-wider mb-2">
              4 HORIZONS GROUP
            </Text>
            <div className="text-[11px] text-primary-600 space-y-0.5">
              <p>
                <span className="font-bold text-[#002B5B]">Khalil A. Khan</span> | Project Coordinator
              </p>
              <p>Four Horizons Group | Jeddah | Saudi Arabia</p>
              <p>
                Mob: +966 56 513 2728 | E-mail:{" "}
                <a href="#" className="text-[#0066FF] hover:underline">
                  khalil.khan@4horizons.com.sa
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
