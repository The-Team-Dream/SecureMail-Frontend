"use client";

import React from "react";
import { MailToolbar } from "./MailToolbar";
import { MailTabs } from "./MailTabs";
import { MailList } from "./MailList";
import { useMailStore } from "@/stores/useMailStore";
import Container from "../shared/Container";
import { SearchAutocomplete } from "./SearchAutocomplete";

export const MailInbox = () => {
  const activeFolder = useMailStore((s) => s.activeFolder);

  return (
    <Container>
      <div className="flex flex-col h-full bg-background">
        <div className="block md:hidden mb-4">
          <SearchAutocomplete inputClassName="bg-primary-100/20 w-full" />
        </div>
        <MailToolbar />
        <MailTabs />
        <MailList />
      </div>
    </Container>
  );
};
