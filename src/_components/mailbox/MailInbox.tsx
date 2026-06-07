"use client";
import { MailToolbar } from "@/_components/mailbox/MailToolbar";
import { MailList } from "@/_components/mailbox/MailList";
import Container from "@/_components/shared/Container";
import { SearchAutocomplete } from "@/_components/mailbox/SearchAutocomplete";
import { ScanQueueBanner } from "@/_components/mailbox/ScanQueueBanner";

export const MailInbox = () => {
  return (
    <Container>
      <div className="flex flex-col h-full bg-background">
        <div className="block md:hidden mb-4">
          <SearchAutocomplete inputClassName="bg-primary-100/20 w-full" />
        </div>
        <MailToolbar />
        <div className="mt-2">
          <ScanQueueBanner />
        </div>
        <div className="mt-2">
          <MailList />
        </div>
      </div>
    </Container>
  );
};
