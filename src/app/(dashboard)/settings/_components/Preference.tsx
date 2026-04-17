"use client";
import { Text } from "@/_components/shared/Text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Pencil, X, Save } from "lucide-react";
import { useState } from "react";

const Preference = () => {
  const [isEditing, setIsEditing] = useState(false);

  const notificationSections = [
    {
      title: "Push notifications",
      items: [
        "New Login Detected",
        "Weekly security report",
        "Low mailbox space",
      ],
    },
    {
      title: "Email notifications",
      items: ["Newsletter and updates", "Failed delivery reports"],
    },
    {
      title: "Security alerts",
      items: [
        "Password change alerts",
        "Unusual activity detected",
        "Two-factor recovery used",
      ],
    },
  ];

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
              <div className="flex items-center gap-4">
                <Bell className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                <div>
                  <Text size={"lg"} color={"primary-950"} as={"h1"}>
                    Notifications
                  </Text>
                  <Text
                    size={"sm"}
                    color={"primary-500"}
                    className="text-[11px] sm:text-sm"
                  >
                    Emails notifications and security alerts
                  </Text>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className={`gap-2 transition-all ${isEditing ? "bg-error-600 hover:bg-error-700 text-background" : "bg-transparent"}`}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <>
                    <X
                      className={`w-4 h-4 ${isEditing ? "text-background" : "text-primary-800"}`}
                    />
                    <Text
                      as={"span"}
                      font={"medium"}
                      className={
                        isEditing
                          ? "text-background hidden sm:inline"
                          : "text-primary-800"
                      }
                    >
                      Cancel Editing
                    </Text>
                  </>
                ) : (
                  <>
                    <Pencil className="w-4 h-4" />
                    <Text
                      as={"span"}
                      color={"primary-800"}
                      font={"medium"}
                      className="hidden sm:inline"
                    >
                      Edit
                    </Text>
                  </>
                )}
              </Button>
            </div>

            {notificationSections.map((section, index) => (
              <div
                key={index}
                className="border border-primary-100 py-6 px-8 rounded-lg"
              >
                <Text
                  color={"secondary-800"}
                  font={"medium"}
                  className="mb-4 block"
                >
                  {section.title}
                </Text>
                <div className="flex flex-col gap-4">
                  {section.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex items-center justify-between"
                    >
                      <Text
                        size={"sm"}
                        color={isEditing ? "primary-900" : "primary-400"}
                      >
                        {item}
                      </Text>
                      <Switch disabled={!isEditing} />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end pt-4">
                <Button size={'sm'} onClick={() => setIsEditing(false)} className="w-max">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Preference;
