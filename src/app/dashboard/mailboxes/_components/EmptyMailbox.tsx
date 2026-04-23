import React from "react";
import Image from "next/image";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";

interface EmptyMailboxProps {
  onAddAccount: () => void;
}

export function EmptyMailbox({ onAddAccount }: EmptyMailboxProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-160px)] px-4 animate-in fade-in duration-500">
      <div className="flex flex-col items-center justify-center max-w-[560px] mx-auto text-center">
        
        {/* Graphic Area */}
        {/* Placeholder if the image isn't in public/images yet */}
        <div className="w-[200px] h-[200px] mb-8 relative flex items-center justify-center">
           {/* Fallback SVG logic for presentation, until the user replaces it with the actual PNG file */}
           <Image 
             src="/images/empty-mailbox.png" 
             alt="Empty Mailbox" 
             fill 
             className="object-contain" 
             priority
             onError={(e) => {
               // Fallback if image is missing
               e.currentTarget.style.display = 'none';
               const parent = e.currentTarget.parentElement;
               if (parent) {
                 parent.innerHTML = `<span class="text-xs text-center text-gray-400">Please put empty-mailbox.png<br/>in public/images/</span>`;
               }
             }}
           />
        </div>

        {/* Title */}
        <Text as="h2" size="4xl" font="normal" className="text-primary-900 tracking-tight mb-3">
          Empty Mailbox
        </Text>
        
        {/* Subtitle */}
        <Text size="sm" className="text-[#AAAAAE] font-normal leading-[1.6] mb-8 px-2">
          You don't have any accounts here, Please add new account by clicking on the below button
        </Text>

        {/* Action Button */}
        <Button 
          onClick={onAddAccount}
          className="bg-black text-white hover:bg-gray-900 rounded-[12px] w-[271px] h-[56px] font-medium transition-all shadow-md flex items-center justify-center gap-2.5 text-base"
        >
          Add Mailbox <span className="font-light text-lg pb-[2px]">+</span>
        </Button>
      </div>
    </div>
  );
}
