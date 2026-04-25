import { redirect } from "next/navigation";

export default function SecurityReportsRedirect() {
  redirect("/dashboard/mailboxes");
}
