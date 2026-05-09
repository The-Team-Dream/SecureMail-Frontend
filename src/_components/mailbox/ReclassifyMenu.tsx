"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Icons } from "@/constants/icons";
import { Text } from "../shared/Text";
import { useEmailActions } from "@/APIs/hooks/useEmails";
import type { EmailFolder } from "@/APIs/types/Email";

interface ReclassifyMenuProps {
  emailId: string;
}

export const ReclassifyMenu = ({ emailId }: ReclassifyMenuProps) => {
  const router = useRouter();
  const { mailboxId } = useParams();
  const { reclassifyMutation, reportMutation } = useEmailActions(
    mailboxId as string,
  );

  const handleReclassify = async (folder: EmailFolder) => {
    await reclassifyMutation.mutateAsync({ id: emailId, folder });
    router.push(`/mailboxes/${mailboxId}/${folder}`);
  };

  const handleReport = async (type: "spam" | "phishing" | "malware") => {
    await reportMutation.mutateAsync({ id: emailId, type });
    router.push(`/mailboxes/${mailboxId}/${type}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="lg" className="w-fit h-[40px] md:h-[55px] rounded-lg">
          <span className="text-xs md:text-base font-normal">Reclassify</span>
          <span className="hidden md:block text-primary-500">|</span>
          <ChevronUp className="w-4 h-4 md:w-5 md:h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[250px] rounded-xl p-2 shadow-[0px_20px_50px_rgba(0,0,0,0.1)] border border-primary-100 bg-primary-50 mb-2"
        side="top"
        align="end"
        sideOffset={12}
      >
        <DropdownMenuItem
          onClick={() => handleReclassify("inbox")}
          className="flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer group hover:text-primary transition-colors data-highlighted:bg-background "
        >
          <Icons.Inbox className="w-5 h-5 group-hover:text-primary" />
          <Text
            as={"span"}
            font={"medium"}
            className="text-primary-400 group-hover:text-primary flex-1 text-sm"
          >
            Inbox
          </Text>
          <ChevronRight className="w-4 h-4 text-primary-400 group-hover:text-primary transition-colors" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleReport("spam")}
          className="flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer group hover:text-primary transition-colors data-highlighted:bg-background "
        >
          <Icons.Spam className="w-5 h-5 group-hover:text-primary" />
          <Text
            as={"span"}
            font={"medium"}
            className="text-primary-400 group-hover:text-primary flex-1 text-sm"
          >
            Spam
          </Text>
          <ChevronRight className="w-4 h-4 text-primary-400 group-hover:text-primary transition-colors" />
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-primary-100/50" />
        <DropdownMenuItem
          onClick={() => handleReport("phishing")}
          className="flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer group hover:text-primary transition-colors data-highlighted:bg-background "
        >
          <Icons.Phishing className="w-5 h-5 group-hover:text-primary" />
          <Text
            as={"span"}
            font={"medium"}
            className="text-primary-400 group-hover:text-primary flex-1 text-sm"
          >
            Phishing
          </Text>
          <ChevronRight className="w-4 h-4 text-primary-400 group-hover:text-primary transition-colors" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleReport("malware")}
          className="flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer group hover:text-primary transition-colors data-highlighted:bg-background "
        >
          <Icons.Malware className="w-5 h-5 group-hover:text-primary" />
          <Text
            as={"span"}
            font={"medium"}
            className="text-primary-400 group-hover:text-primary flex-1 text-sm"
          >
            Malware
          </Text>
          <ChevronRight className="w-4 h-4 text-primary-400 group-hover:text-primary transition-colors" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
