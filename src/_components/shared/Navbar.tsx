"use client";

import { useState } from "react";
import {
  Check,
  ChevronRight,
  Plus,
  User,
  ShieldAlert,
  Layers,
  Mail,
  Pencil,
} from "lucide-react";
import Logo from "./Logo";
import { Text } from "@/_components/shared/Text";
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
import { usePathname, useParams, useRouter } from "next/navigation";
import { MobileSidebar } from "./MobileSidebar";
import { SearchAutocomplete } from "../mailbox/SearchAutocomplete";
import Link from "next/link";
import { NotificationDropdown } from "../Notification";
import { getImageUrl, cn, getFirstName } from "@/lib/utils";
import { useGetAuthMe } from "@/APIs/hooks/auth";
import { useMailboxes } from "@/APIs/hooks/mailboxes";
import { useAnalyticsOverview } from "@/APIs/hooks/analytics";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";

export const Navbar = () => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const mailboxId = params?.mailboxId as string | undefined;
  const { data: mailboxes = [], isPending: mailboxesLoading } = useMailboxes();
  const { data: user } = useGetAuthMe();
  const { data: analytics } = useAnalyticsOverview();

  const isMailPage =
    pathname.split("/").length >= 3 && pathname.startsWith("/mailboxes");
  const [selectedMailboxId, setSelectedMailboxId] = useState<
    string | number | null
  >(null);

  const activeAccount =
    mailboxes.find(
      (m) => String(m.id) === String(mailboxId || selectedMailboxId),
    ) ||
    mailboxes[0] ||
    null;

  const sortedMailboxes = [...mailboxes].sort((a, b) => {
    if (a.id === activeAccount?.id) return -1;
    if (b.id === activeAccount?.id) return 1;
    return 0;
  });

  const userData = user?.user;
  const userAvatar = userData?.avatar ?? null;
  const userName = userData?.username ?? "User";
  const userEmail = userData?.email ?? "";

  const [isSwitching, setIsSwitching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const triggerAvatar = isMailPage
    ? ((activeAccount as any)?.avatar ?? userAvatar)
    : userAvatar;

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

  // Calculate danger level
  const totalRisky =
    (analytics?.totalPhishingDetected || 0) +
    (analytics?.totalSpamDetected || 0);
  const totalEmails = analytics?.totalEmails || 1;
  const dangerPercentage = Math.min(
    Math.round((totalRisky / totalEmails) * 100),
    100,
  );

  const healthColor =
    dangerPercentage < 10
      ? "text-green-500"
      : dangerPercentage < 30
        ? "text-warning-500"
        : "text-error-500";
  const healthBg =
    dangerPercentage < 10
      ? "bg-green-500"
      : dangerPercentage < 30
        ? "bg-warning-500"
        : "bg-error-500";

  return (
    <nav className="flex items-center justify-between py-4 px-4.5 bg-background sticky top-0 z-50 shadow-[0_4px_16px_0_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-2">
        <MobileSidebar />
        <Logo
          width={40}
          height={40}
          imgClassName="w-10 h-10 md:w-10 md:h-10"
          textClassName="text-xl md:text-2xl"
        />
        {isMailPage && (
          <div className="ml-18 hidden lg:block">
            <SearchAutocomplete inputClassName="w-[600px] bg-primary-100/10" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <NotificationDropdown />

        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center  cursor-pointer outline-none overflow-hidden">
              {triggerAvatar ? (
                <Image
                  src={getImageUrl(triggerAvatar)}
                  alt="avatar"
                  width={64}
                  height={64}
                  quality={90}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="size-6 text-primary" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-[300px] w-[calc(100vw-32px)] md:min-w-[400px] md:w-auto bg-primary-50 border border-primary-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-5 flex flex-col gap-5"
          >
            <div className="flex flex-col items-center justify-center pt-2">
              <Link
                href="/profile"
                className="w-16 h-16 md:w-[120px] md:h-[120px] rounded-full bg-secondary-100 flex items-center justify-center  overflow-hidden hover:scale-105 transition-transform"
                onClick={() => setIsDropdownOpen(false)}
              >
                {isSwitching ? (
                  <Spinner className="w-10 h-10 text-secondary-900" />
                ) : userAvatar ? (
                  <Image
                    src={getImageUrl(userAvatar)}
                    alt="avatar"
                    width={120}
                    height={120}
                    quality={100}
                    priority
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="size-8 text-secondary-900" />
                )}
              </Link>
              <div className="mt-3 flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <Text as="h3" font="bold" size="lg">
                    Hi, {getFirstName(userName)}!
                  </Text>
                  <Link
                    href="/settings"
                    className="p-1.5 rounded-full hover:bg-primary-100 transition-colors text-primary"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Pencil className="size-4" />
                  </Link>
                </div>
                <Text as="p" size="sm" color="muted" className="mt-0.5">
                  {userEmail}
                </Text>
                <Link
                  href="/profile"
                  className="mt-2 text-xs font-bold text-secondary-800 hover:underline flex items-center gap-1 group"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  View Full Profile
                  <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Quick Stats Section */}
            {!isMailPage && analytics && (
              <div className="flex flex-col gap-4 p-5 bg-primary-100/20 rounded-2xl border border-primary-100/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <Text
                    font="bold"
                    size="xs"
                    color="muted"
                    className="uppercase tracking-widest opacity-70"
                  >
                    Global Security Status
                  </Text>
                  <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-background/50 border border-primary-100/50">
                    <div
                      className={cn(
                        "size-1.5 rounded-full animate-pulse",
                        healthBg,
                      )}
                    />
                    <Text size="xs" font="bold" className={healthColor}>
                      {dangerPercentage < 10
                        ? "Protected"
                        : dangerPercentage < 30
                          ? "Attention"
                          : "High Risk"}
                    </Text>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 opacity-60">
                      <Layers size={14} className="text-primary-500" />
                      <Text size="xs" font="medium">
                        Mailboxes
                      </Text>
                    </div>
                    <Text font="bold" size="default">
                      {analytics.totalMailboxesConnected}
                    </Text>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 opacity-60">
                      <Mail size={14} className="text-primary-500" />
                      <Text size="xs" font="medium">
                        Emails
                      </Text>
                    </div>
                    <Text font="bold" size="default">
                      {analytics.totalEmails.toLocaleString()}
                    </Text>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 opacity-60">
                      <ShieldAlert size={14} className="text-primary-500" />
                      <Text size="xs" font="medium">
                        Threats
                      </Text>
                    </div>
                    <Text font="bold" size="default" className={healthColor}>
                      {dangerPercentage}%
                    </Text>
                  </div>
                </div>

                <div className="relative w-full h-2 bg-primary-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dangerPercentage}%` }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full transition-all duration-700",
                      healthBg,
                    )}
                  />
                </div>
              </div>
            )}

            {isMailPage && (
              <div>
                {mailboxesLoading ? (
                  <div className="flex items-center justify-center p-10 bg-background rounded-lg border border-primary-100 mb-1">
                    <Spinner className="size-8 text-primary" />
                  </div>
                ) : (
                  <Accordion type="single" collapsible defaultValue="accounts">
                    <AccordionItem value="accounts" className="border-none">
                      <AccordionTrigger
                        className="cursor-pointer bg-background rounded-tl-lg rounded-tr-lg p-4 mb-1 group"
                        icon={
                          mailboxes.length === 0 ? (
                            <ChevronRight className="size-4 text-primary" />
                          ) : undefined
                        }
                        rotateIcon={mailboxes.length !== 0}
                        disabled={mailboxes.length === 0}
                      >
                        <div className="flex items-center justify-between w-full -mr-2">
                          <Text font="semiBold" size="sm" color="primary-950">
                            Switch Account
                          </Text>
                          <div className="flex items-center -space-x-1.5 opacity-100 group-data-[state=open]:opacity-0 group-data-[state=open]:invisible transition-all duration-200">
                            {sortedMailboxes.slice(0, 3).map((mailbox, i) => (
                              <div
                                key={mailbox.id}
                                className="w-6 h-6 rounded-full border-2 border-background bg-primary-100 flex items-center justify-center overflow-hidden"
                                style={{ zIndex: 10 - i }}
                              >
                                {(mailbox as any).avatar ? (
                                  <Image
                                    src={getImageUrl((mailbox as any).avatar)}
                                    alt="avatar"
                                    width={32}
                                    height={32}
                                    quality={90}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User className="size-4 text-primary" />
                                )}
                              </div>
                            ))}
                            {sortedMailboxes.length > 3 && (
                              <div
                                className="w-6 h-6 rounded-full border-2 border-background bg-primary-50 flex items-center justify-center overflow-hidden"
                                style={{ zIndex: 0 }}
                              >
                                <Text
                                  font="bold"
                                  className="text-[8px]"
                                  color="muted"
                                >
                                  +{sortedMailboxes.length - 3}
                                </Text>
                              </div>
                            )}
                          </div>
                        </div>
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
                                    {(mailbox as any).avatar ? (
                                      <Image
                                        src={getImageUrl(
                                          (mailbox as any).avatar,
                                        )}
                                        alt="avatar"
                                        width={48}
                                        height={48}
                                        quality={90}
                                        className="md:size-10 size-8 rounded-full object-cover"
                                      />
                                    ) : (
                                      <User className="size-5 text-primary" />
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <Text font="bold" className="md:text-sm">
                                      {mailbox.displayName}
                                    </Text>
                                    <Text
                                      size={"sm"}
                                      color="muted"
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

                <DropdownMenuItem asChild>
                  <Link
                    href={"/mailboxes?step=1"}
                    className="py-4 flex items-center gap-3 w-full cursor-pointer bg-background hover:bg-primary-50 transition-colors outline-none rounded-bl-lg rounded-br-lg"
                  >
                    <Plus className="size-5 text-primary" />
                    <Text font="medium" size="sm">
                      Add New Account
                    </Text>
                  </Link>
                </DropdownMenuItem>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
