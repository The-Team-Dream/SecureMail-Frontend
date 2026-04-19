"use client";

import React from "react";
import { MailToolbar } from "./MailToolbar";
import { MailTabs } from "./MailTabs";
import { MailList } from "./MailList";
import { useMailStore } from "@/stores/useMailStore";
import Container from "../shared/Container";
import { Input } from "../shared/Input";
import { Mail } from "lucide-react";

export const MailInbox = () => {
  const activeFolder = useMailStore((s) => s.activeFolder);

  return (
    <Container>
      <div className="flex flex-col h-full bg-background">
        <div className="block md:hidden mb-4">
          <Input
            className="bg-primary-100/20 w-full"
            type="search"
            leftIcon={<Mail className="w-5 h-5 text-primary-500" />}
            placeholder="Search Email..."
          />
        </div>
        <MailToolbar />
        <MailTabs />
        <MailList />
      </div>
    </Container>
  );
};
