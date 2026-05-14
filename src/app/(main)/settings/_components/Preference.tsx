"use client";
import { memo, useCallback } from "react";
import { Text } from "@/_components/shared/Text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Icons } from "@/constants/icons";
import { Bell, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  useGetUserSettings,
  useUpdateNotifications,
} from "@/APIs/hooks/userSettings";
import { toast } from "sonner";

const Preference = memo(() => {
  const { data: settings, isLoading } = useGetUserSettings();
  const { mutate: updateNotifications, isPending: isUpdating } =
    useUpdateNotifications();

  const notificationsEnabled = Boolean(settings?.notificationsEnabled);

  const handleToggle = useCallback((checked: boolean) => {
    updateNotifications(checked);
  }, []);

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <Text font={"semiBold"} color={"primary-950"} size={"2xl"}>
            Preferences
          </Text>
        </AccordionTrigger>
        <AccordionContent>
          <div className="border border-primary-100 py-6 px-8 rounded-lg space-y-4">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-4">
                  <Bell className="shrink-0 w-8 h-8 text-primary" />
                  <div>
                    <Text size={"lg"} color={"primary-950"} as={"h1"}>
                      Notifications
                    </Text>
                    <Text
                      size={"sm"}
                      color={"primary-500"}
                      className="text-[11px] sm:text-sm"
                    >
                      Receive emails, notifications, and security alerts
                    </Text>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isLoading && (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                )}
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={handleToggle}
                  disabled={isLoading || isUpdating}
                />
              </div>
            </div>
          </div>
          <div className="border border-primary-100 py-6 px-8  rounded-lg space-y-4 flex justify-between items-center mt-6">
            <div className="flex items-center gap-4">
              <Icons.Reports className="shrink-0 w-6 h-6 text-primary" />
              <div>
                <Text font={"semiBold"} color={"primary-950"} as={"h1"}>
                  Privacy & Security
                </Text>
                <Text
                  size={"sm"}
                  color={"primary-500"}
                  className="text-[11px] sm:text-sm"
                >
                  Encryption keys, Biometrics
                </Text>
              </div>
            </div>

            <Link href={""}>
              <ChevronRight className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
});

export default Preference;
