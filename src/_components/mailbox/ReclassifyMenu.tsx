"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ChevronUp, ChevronRight, ChevronDown, FolderSync } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Icons } from "@/constants/icons";
import { Text } from "@/_components/shared/Text";
import { useReclassifyEmail, useReportEmail } from "@/APIs/hooks/emails";
import type { EmailFolder } from "@/APIs/types/Email";

interface ReclassifyMenuProps {
  emailId: string;
  triggerType?: "default" | "action-button";
}

export const ReclassifyMenu = ({ emailId, triggerType = "default" }: ReclassifyMenuProps) => {
  const router = useRouter();
  const { mailboxId } = useParams();
  const reclassifyMutation = useReclassifyEmail(mailboxId as string);
  const reportMutation = useReportEmail(mailboxId as string);

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
        {triggerType === "action-button" ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={reclassifyMutation.isPending}
            className="rounded-full text-primary-700 hover:bg-primary-50 size-9 items-center justify-center transition-all cursor-pointer"
            aria-label="Reclassify"
          >
            {reclassifyMutation.isPending ? (
              <Spinner className="w-4 h-4" />
            ) : (
              <FolderSync className="w-4 h-4 text-primary" />
            )}
          </Button>
        ) : (
          <Button disabled={reclassifyMutation.isPending} className="w-fit gap-2">
            {reclassifyMutation.isPending ? (
              <>
                <span className="text-sm font-normal">Reclassifying...</span>
                <Spinner className="w-4 h-4" />
              </>
            ) : (
              <>
                <span className="text-sm font-normal hidden sm:flex">
                  Reclassify
                </span>
                <FolderSync className="flex sm:hidden" />
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
        )}
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
          onClick={() => handleReclassify("sent")}
          className="flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer group hover:text-primary transition-colors data-highlighted:bg-background "
        >
          <Icons.Sent className="w-5 h-5 group-hover:text-primary" />
          <Text
            as={"span"}
            font={"medium"}
            className="text-primary-400 group-hover:text-primary flex-1 text-sm"
          >
            Sent
          </Text>
          <ChevronRight className="w-4 h-4 text-primary-400 group-hover:text-primary transition-colors" />
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-primary-100/50" />
        <DropdownMenuItem
          onClick={() => handleReclassify("spam")}
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
        <DropdownMenuItem
          onClick={() => handleReclassify("phishing")}
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
          onClick={() => handleReclassify("trash")}
          className="flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer group hover:text-primary transition-colors data-highlighted:bg-background "
        >
          <Icons.Delete className="w-5 h-5 group-hover:text-primary" />
          <Text
            as={"span"}
            font={"medium"}
            className="text-primary-400 group-hover:text-primary flex-1 text-sm"
          >
            Trash
          </Text>
          <ChevronRight className="w-4 h-4 text-primary-400 group-hover:text-primary transition-colors" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
