"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMailStore } from "@/stores/useMailStore";
import { Text } from "../shared/Text";
import { useRouter } from "next/navigation";
import { ReclassifyMenu } from "./ReclassifyMenu";
import { getInitials } from "@/lib/utils";

export const MailDetails = ({ emailId }: { emailId: string }) => {
  const router = useRouter();
  const emails = useMailStore((s) => s.emails);

  const email = emails.find((e) => e.id === emailId);

  if (!email) return null;

  return (
    <div className="flex flex-col h-full bg-background p-4 sm:p-8 duration-300">
      <div className="mb-6">
        <Text size="2xl" font="semiBold">
          {email.subject}
        </Text>
      </div>

      <div className="flex items-center gap-4 mb-8">
        {/* Avatar Placeholder */}
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
          <Text
            size="lg"
            font="bold"
            color={"primary-600"}
            className="uppercase"
          >
            {getInitials(email.sender)}
          </Text>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Text font="medium">{email.sender}</Text>
            <Text size="sm" color="primary-500">
              &lt;{email.senderEmail}&gt;
            </Text>
          </div>
          <Text size="sm" color="primary-500">
            to me
          </Text>
        </div>
      </div>

      <div className="flex-1 border-l-2 border-primary-100 pl-6 ml-6">
        <div className="text-primary-800 space-y-6 text-[15px] leading-relaxed">
          <Text>Dear Mohamed,</Text>
          <Text>{email.bodyText}</Text>
          <Text>Best Regards,</Text>

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
            <Text size="xs" font="bold" className="text-[#002B5B] mb-2">
              4 HORIZONS GROUP
            </Text>
            <div className="text-[11px] text-primary-600 space-y-0.5">
              <p>
                <span className="font-bold text-[#002B5B]">Khalil A. Khan</span>{" "}
                | Project Coordinator
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
      {/* Buttons */}
      <div className="sm:mx-0 py-3! px-8! flex items-center justify-between -mx-8! sm:p-0 mt-14 shadow-[0px_4px_16px_rgba(0,0,0,0.1)] ">
        <Button
          variant="outline"
          size="sm"
          className="md:w-[80px] md:h-[55px] font-medium border border-primary-100 text-primary-800"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
          <Text className="">Back</Text>
        </Button>
        <ReclassifyMenu emailId={emailId} />
      </div>
    </div>
  );
};
