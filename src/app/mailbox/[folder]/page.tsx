import { redirect } from "next/navigation";

export default function FolderWithoutIdPage() {
  redirect("/dashboard/mailboxes");
}
