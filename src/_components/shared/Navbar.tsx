"use client";

import { useState } from "react";
import { Bell, Check, ChevronRight, Plus } from "lucide-react";
import Logo from "./Logo";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// Image removed in favor of standard img
import { usePathname, useParams, useRouter } from "next/navigation";
import { MobileSidebar } from "./MobileSidebar";
import { SearchAutocomplete } from "../mailbox/SearchAutocomplete";
import Link from "next/link";
import { NotificationDropdown } from "../Notification";
import { Icons } from "@/constants/icons";
import { getInitials, getImageUrl, cn } from "@/lib/utils";
import { useGetAuthMe } from "@/APIs/hooks/useAuth";
import { useMailboxes } from "@/APIs/hooks/mailboxes";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { ActionButton } from "./ActionButton";

export const Navbar = () => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const mailboxId = params?.mailboxId as string | undefined;

  const { data: mailboxes = [], isPending: mailboxesLoading } = useMailboxes();
  const { data: user, isPending, isError } = useGetAuthMe();

  const isMailPage =
    pathname.split("/").length >= 3 && pathname.startsWith("/mailboxes");
  const [selectedMailboxId, setSelectedMailboxId] = useState<
    string | number | null
  >(null);

  const activeAccount =
    mailboxes.find((m) => m.id === (mailboxId || selectedMailboxId)) ||
    mailboxes[0] ||
    null;

  const sortedMailboxes = [...mailboxes].sort((a, b) => {
    if (a.id === activeAccount?.id) return -1;
    if (b.id === activeAccount?.id) return 1;
    return 0;
  });

  const userData = user?.user || user;
  const displayName =
    activeAccount?.displayName ?? userData?.username ?? "User";
  const [isSwitching, setIsSwitching] = useState(false);

  const displayEmail = activeAccount?.emailAddress ?? userData?.email ?? "";
  const displayAvatar = userData?.avatar ?? null;
  const initials = getInitials(displayName);

  const handleSwitchAccount = async (id: string | number) => {
    setIsSwitching(true);
    setSelectedMailboxId(id);
    if (mailboxId) {
      router.push(
        pathname.replace(`/mailboxes/${mailboxId}`, `/mailboxes/${id}`),
      );
    }
    setTimeout(() => setIsSwitching(false), 800);
  };

  return (
    <nav className="flex items-center justify-between py-6 px-4.5 bg-background sticky top-0 z-50 shadow-[0_4px_16px_0_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-2">
        <MobileSidebar />
        <Logo
          width={40}
          height={40}
          imgClassName="w-10 h-10 md:w-10 md:h-10"
          textClassName="text-xl md:text-2xl"
        />
        {isMailPage && (
          <div className="ml-18 hidden md:block">
            <SearchAutocomplete inputClassName="w-[600px] bg-primary-100/10" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <NotificationDropdown />
        <Link
          href={mailboxId ? `/mailboxes/${mailboxId}/settings` : "/settings"}
        >
          <ActionButton
            icon={
              <Icons.Settings
                className={cn(
                  pathname.includes("/settings")
                    ? "text-primary"
                    : "text-primary-600",
                )}
              />
            }
            label="Settings"
            onClick={() => {}}
            className={cn(
              pathname.includes("/settings")
                ? "bg-primary-200 text-primary"
                : "text-primary-600",
            )}
          />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center border border-secondary-900 cursor-pointer outline-none overflow-hidden">
              {displayAvatar ? (
                <Image
                  src={getImageUrl(displayAvatar)}
                  alt="avatar"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <Text color="secondary-900" font="medium">
                  {initials}
                </Text>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-[300px] w-[calc(100vw-32px)] md:min-w-[400px] md:w-auto bg-primary-50 border border-primary-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-5 flex flex-col gap-5"
          >
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full bg-secondary-100 flex items-center justify-center border border-secondary-900 overflow-hidden">
                {isSwitching ? (
                  <Spinner className="w-10 h-10 text-secondary-900" />
                ) : displayAvatar ? (
                  <Image
                    src={getImageUrl(displayAvatar)}
                    alt="avatar"
                    width={72}
                    height={72}
                    className="w-[72px] h-[72px] rounded-full object-cover"
                  />
                ) : (
                  <Text color="secondary-900" font="bold" size="2xl">
                    {initials}
                  </Text>
                )}
              </div>
              <div className="mt-3 text-center">
                <Text as="h3" font="bold" size="lg" color={"primary-950"}>
                  Hi, {displayName.split(" ")[0]}!
                </Text>
                <Text as="p" size="sm" color={"primary-500"} className="mt-0.5">
                  {displayEmail}
                </Text>
              </div>
            </div>

            <div>
              {mailboxesLoading ? (
                <div className="flex items-center justify-center p-10 bg-background rounded-lg border border-primary-100 mb-1">
                  <Spinner className="size-8 text-primary" />
                </div>
              ) : (
                <Accordion type="single" collapsible defaultValue="accounts">
                  <AccordionItem value="accounts" className="border-none">
                    <AccordionTrigger
                      className="cursor-pointer bg-background rounded-tl-lg rounded-tr-lg p-4 mb-1"
                      icon={
                        mailboxes.length === 0 ? (
                          <ChevronRight className="size-4 text-primary" />
                        ) : undefined
                      }
                      rotateIcon={mailboxes.length !== 0}
                      disabled={mailboxes.length === 0}
                    >
                      <Text font="semiBold" size="sm" color="primary-950">
                        Switch Account
                      </Text>
                    </AccordionTrigger>

                    <AccordionContent className="w-full p-0">
                      <div className="flex flex-col w-full">
                        {sortedMailboxes.map((mailbox) => {
                          const isActive = mailbox.id === activeAccount?.id;
                          return (
                            <DropdownMenuItem
                              key={mailbox.id}
                              onClick={() => handleSwitchAccount(mailbox.id)}
                              className="flex items-center justify-between p-4 cursor-pointer hover:bg-primary-50 transition-colors outline-none bg-background mb-1"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`md:size-10 size-8 rounded-full flex items-center justify-center border overflow-hidden ${
                                    isActive
                                      ? "bg-secondary-100 border-secondary-900"
                                      : "bg-primary-100 border-primary-500"
                                  }`}
                                >
                                  {((mailbox as any).avatar ||
                                  (mailbox.userId == userData?.id &&
                                    userData?.avatar)) ? (
                                    <Image
                                      src={getImageUrl(
                                        (mailbox as any).avatar || userData?.avatar,
                                      )}
                                      alt="avatar"
                                      width={40}
                                      height={40}
                                      className="md:size-10 size-8 rounded-full object-cover"
                                    />
                                  ) : (
                                    <Text
                                      font="bold"
                                      className="text-[10px] md:text-base"
                                      color={
                                        isActive
                                          ? "secondary-900"
                                          : "primary-500"
                                      }
                                    >
                                      {getInitials(
                                        mailbox.displayName ||
                                          mailbox.emailAddress ||
                                          "",
                                      )}
                                    </Text>
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <Text font="bold" className="md:text-sm">
                                    {mailbox.displayName}
                                  </Text>
                                  <Text
                                    size={"sm"}
                                    color={"primary-500"}
                                    className="text-[10px] md:text-sm"
                                  >
                                    {mailbox.emailAddress}
                                  </Text>
                                </div>
                              </div>
                              {isActive && (
                                <div className="size-6 rounded-full bg-secondary-700 flex items-center justify-center">
                                  <Check className="size-3.5 text-background stroke-[3px]" />
                                </div>
                              )}
                            </DropdownMenuItem>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              <DropdownMenuItem className="p-4 flex items-center gap-3 cursor-pointer bg-background hover:bg-primary-50 transition-colors outline-none rounded-bl-lg rounded-br-lg">
                <Link href={"/mailboxes"} className="flex items-center gap-2">
                  <Plus className="size-5 text-primary" />
                  <Text font="medium" size="sm">
                    Add New Account
                  </Text>
                </Link>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
