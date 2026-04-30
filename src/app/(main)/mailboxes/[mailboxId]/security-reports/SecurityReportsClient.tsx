"use client";

import Container from "@/_components/shared/Container";
import { Text } from "@/_components/shared/Text";

export default function SecurityReportsClient({ mailboxId }: { mailboxId: string }) {
  return (
    <Container>
      <Text as="h1" size="2xl" font="semiBold">
        Security Reports
      </Text>
    </Container>
  );
}
