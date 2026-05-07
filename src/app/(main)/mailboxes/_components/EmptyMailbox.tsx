import React from "react";
import Image from "next/image";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";

import emptyMailboxImg from "../../../../../public/images/empty-mailbox.png";

interface EmptyMailboxProps {
  onAddAccount: () => void;
}

export function EmptyMailbox({ onAddAccount }: EmptyMailboxProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-160px)] px-4 animate-in fade-in duration-500">
      <div className="flex flex-col items-center justify-center max-w-[600px] mx-auto text-center">
        {/* Graphic Area */}
        <div className="w-[200px] h-[200px] mb-8 relative flex items-center justify-center">
          <Image
            src={emptyMailboxImg}
            alt="Empty Mailbox"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Title */}
        <Text as="h2" size="32" font="normal" className="  mb-3">
          Empty Mailbox
        </Text>

        {/* Subtitle */}
        <Text size={'sm'} className="text-[#AAAAAE] leading-[1.6] mb-8 px-2">
          You don&apos;t have any accounts here, Please add new account by
          clicking on the below button
        </Text>

        {/* Action Button */}
        <Button
          onClick={onAddAccount}
          className="rounded-[12px] w-[271px] h-[56px] font-medium transition-all shadow-md gap-2.5 text-base"
        >
          Add Mailbox <span className="font-light text-3xl pb-[2px]">+</span>
        </Button>
      </div>
    </div>
  );
}
