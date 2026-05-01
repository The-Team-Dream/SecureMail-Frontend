"use client";

import { useState } from "react";
import { Bell, Check, Plus } from "lucide-react";
import Logo from "./Logo";
import { Text } from "./Text";
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
import Image from "next/image";
import { initialAccounts } from "@/constants/MOCKDATA";
import { usePathname, useRouter, useParams } from "next/navigation";
import { MobileSidebar } from "./MobileSidebar";
import { SearchAutocomplete } from "../mailbox/SearchAutocomplete";
import Link from "next/link";
import { Icons } from "@/constants/icons";

export const Navbar = () => {
  const pathname = usePathname();
  const params = useParams();
  const mailboxId = params?.mailboxId;
  const [accounts, setAccounts] = useState(initialAccounts);
  const isMailPage =
    pathname.split("/").length >= 3 && pathname.startsWith("/mailboxes");

  const activeAccount = accounts.find((user) => user.active) || accounts[0];

  const handleSwitchAccount = (id: number) => {
    const updatedAccounts = accounts.map((account) => ({
      ...account,
      active: account.id === id,
    }));
    setAccounts(updatedAccounts);
  };

  return (
    <nav className="flex items-center justify-between py-6 px-4.5 bg-background sticky top-0 z-50 shadow-[0_4px_16px_0_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-2">
        <MobileSidebar />
        <Logo width={40} height={40} textSize={"2xl"} />
        {isMailPage && (
          <div className="ml-18 hidden md:block">
            <SearchAutocomplete inputClassName="w-[600px] bg-primary-100/10" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={mailboxId ? `/mailboxes/${mailboxId}/settings` : "/settings"}
        >
          <Button
            size="icon-sm"
            variant="ghost"
            className={`${pathname.includes("/settings") ? "bg-primary-200 text-primary" : "text-primary-600"} relative`}
          >
            <Icons.Settings
              className={`${pathname.includes("/settings") ? "text-primary" : "text-primary-600"}  `}
            />
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center border border-secondary-900 cursor-pointer outline-none overflow-hidden">
              {activeAccount.avatar ? (
                <Image
                  src={activeAccount.avatar}
                  alt="avatar"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              ) : (
                <Text color="secondary-900" font="medium">
                  {activeAccount.username.substring(0, 2).toUpperCase()}
                </Text>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-[400px] bg-primary-50 border border-primary-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-5 flex flex-col gap-5"
          >
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="w-[72px] h-[72px] rounded-full bg-secondary-100 flex items-center justify-center border border-secondary-900 overflow-hidden">
                {activeAccount.avatar ? (
                  <Image
                    src={activeAccount.avatar}
                    alt="avatar"
                    width={72}
                    height={72}
                    className="object-cover"
                  />
                ) : (
                  <Text color="secondary-900" font="bold" size="2xl">
                    {activeAccount.username.substring(0, 2).toUpperCase()}
                  </Text>
                )}
              </div>
              <div className="mt-3 text-center">
                <Text as="h3" font="bold" size="lg" color={"primary-950"}>
                  Hi, {activeAccount.username.split(" ")[0]}!
                </Text>
                <Text as="p" size="sm" color={"primary-500"} className="mt-0.5">
                  {activeAccount.email}
                </Text>
              </div>
            </div>

            <div>
              <Accordion type="single" collapsible defaultValue="accounts">
                <AccordionItem value="accounts" className="border-none">
                  <AccordionTrigger className="bg-background rounded-tl-lg rounded-tr-lg p-4 mb-1">
                    <Text font="semiBold" size="sm" color="primary-950">
                      Switch Account
                    </Text>
                  </AccordionTrigger>

                  <AccordionContent className="min-w-[400px] w-full p-0">
                    <div className="flex flex-col w-full">
                      {accounts.map((user) => (
                        <DropdownMenuItem
                          key={user.id}
                          onClick={() => handleSwitchAccount(user.id)}
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-primary-50 transition-colors outline-none bg-background mb-1"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`size-10 rounded-full flex items-center justify-center border overflow-hidden ${
                                user.active
                                  ? "bg-secondary-100 border-secondary-900"
                                  : "bg-primary-100 border-primary-500"
                              }`}
                            >
                              <Text
                                size="xs"
                                font="bold"
                                color={
                                  user.active ? "secondary-900" : "primary-500"
                                }
                              >
                                {user.username.substring(0, 2).toUpperCase()}
                              </Text>
                            </div>
                            <div className="flex flex-col">
                              <Text
                                font="bold"
                                className="text-[14px]"
                                color="primary-950"
                              >
                                {user.username}
                              </Text>
                              <Text size={"sm"} color={"primary-500"}>
                                {user.email}
                              </Text>
                            </div>
                          </div>
                          {user.active && (
                            <div className="size-6 rounded-full bg-secondary-700 flex items-center justify-center">
                              <Check className="size-3.5 text-background stroke-[3px]" />
                            </div>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

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
