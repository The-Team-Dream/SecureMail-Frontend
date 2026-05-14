"use client";
import { MailToolbar } from "@/_components/mailbox/MailToolbar";
import { MailTabs } from "@/_components/mailbox/MailTabs";
import { MailList } from "@/_components/mailbox/MailList";
import Container from "@/_components/shared/Container";
import { SearchAutocomplete } from "@/_components/mailbox/SearchAutocomplete";

export const MailInbox = () => {
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
