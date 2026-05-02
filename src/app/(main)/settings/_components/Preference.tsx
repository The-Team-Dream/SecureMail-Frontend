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
import { Icons } from "@/constants/icons";
import { Bell, Pencil, X, Save, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Preference = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <Text font={"semiBold"} color={"primary-950"} size={"2xl"}>
            Preferences
          </Text>
        </AccordionTrigger>
        <AccordionContent>
          <div className="border border-primary-100 p-4 rounded-lg space-y-4 flex justify-between items-center mt-6">
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
};

export default Preference;
