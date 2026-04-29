"use client";
import { Text } from "@/_components/shared/Text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Laptop, Smartphone } from "lucide-react";
import { useState } from "react";

type DeviceStatus = "active" | "last_active";

interface Device {
  id: string;
  name: string;
  location: string;
  status: DeviceStatus;
  statusText: string;
  isCurrentDevice: boolean;
  deviceType: "mobile" | "desktop";
}

const devices: Device[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    location: "San Francisco, CA",
    status: "active",
    statusText: "Active now",
    isCurrentDevice: true,
    deviceType: "mobile",
  },
  {
    id: "2",
    name: "Chrome on MacOS",
    location: "New York, NY",
    status: "last_active",
    statusText: "2 hours ago",
    isCurrentDevice: false,
    deviceType: "desktop",
  },
  {
    id: "3",
    name: "Safari on MacBook Air",
    location: "New York, NY",
    status: "last_active",
    statusText: "12 Oct 2025",
    isCurrentDevice: false,
    deviceType: "desktop",
  },
];

const SessionManagement = () => {
  const [deviceList, setDeviceList] = useState<Device[]>(devices);

  const handleRevoke = (id: string) => {
    setDeviceList((prev) => prev.filter((device) => device.id !== id));
  };

  const handleRevokeAll = () => {
    setDeviceList((prev) => prev.filter((device) => device.isCurrentDevice));
  };

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <Text font={"semiBold"} color={"primary-950"} size={"2xl"}>
            Session management
          </Text>
        </AccordionTrigger>
        <AccordionContent>
          <div className="border border-primary-100 py-6 px-8 rounded-lg mb-6">
            {/* Heading */}
            <div className="flex items-start md:items-center gap-4">
              <Laptop className="min-w-6 min-h-6 w-8 h-8 text-primary" />
              <div className="flex flex-col">
                <Text color={"primary-950"}>Active Sessions</Text>
                <Text color={"primary-500"} className="text-[11px] sm:text-sm">
                  Review the devices currently signed into your SecureMail
                  account. If you don&apos;t recognize a device revoke its
                  access immediately.
                </Text>
              </div>
            </div>
            {/* Device List */}
            <div className="flex flex-col gap-3 w-full mt-6">
              {deviceList.map((device) => {
                const isCurrent = device.isCurrentDevice;
                const Icon =
                  device.deviceType === "mobile" ? Smartphone : Laptop;

                return (
                  <div
                    key={device.id}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 transition-all duration-300 gap-4 rounded-sm ${
                      isCurrent
                        ? "bg-secondary-50 border-l-4 border-l-secondary-800"
                        : "bg-primary-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                      {/* Icon Container */}
                      <div
                        className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                          isCurrent
                            ? "bg-secondary-200 text-secondary-800"
                            : "bg-background text-primary"
                        }`}
                      >
                        <Icon
                          size={20}
                          className="sm:w-6 sm:h-6"
                          strokeWidth={1.5}
                        />
                      </div>

                      {/* Device Info */}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Text
                            as={"h1"}
                            font={"medium"}
                            className="text-sm sm:text-base truncate"
                          >
                            {device.name}
                          </Text>
                          {isCurrent && (
                            <span className="text-secondary-800 text-[8px] sm:text-sm font-bold uppercase tracking-wider">
                              Current
                            </span>
                          )}
                        </div>
                        <Text
                          as={"span"}
                          color={isCurrent ? "primary-700" : "primary-500"}
                          className="text-[11px] sm:text-sm truncate"
                        >
                          {device.location}{" "}
                          <span
                            className={isCurrent ? "font-bold" : "font-normal"}
                          >
                            •
                          </span>{" "}
                          {device.statusText}
                        </Text>
                      </div>
                    </div>

                    {/* Action Side */}
                    <div className="w-full sm:w-auto flex justify-end sm:block border-t sm:border-t-0 pt-3 sm:pt-0 border-primary-100">
                      {isCurrent ? (
                        <Text
                          as={"span"}
                          color={"secondary-800"}
                          font={"medium"}
                          className="text-xs sm:text-sm"
                        >
                          This device
                        </Text>
                      ) : (
                        <Button
                          size="sm"
                          type="button"
                          onClick={() => handleRevoke(device.id)}
                          className="w-full sm:w-auto border border-error-600 text-error-600 rounded-lg bg-transparent hover:bg-error-600 group px-6"
                        >
                          <Text
                            font={"medium"}
                            className="text-xs sm:text-sm text-error-600 group-hover:text-background transition-colors"
                          >
                            Revoke
                          </Text>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}

              {deviceList.length > 1 && (
                <div className="flex justify-end mt-4">
                  <Button
                    type="button"
                    size={"lg"}
                    onClick={handleRevokeAll}
                    className="bg-error-600 hover:bg-error-700 w-full md:w-max"
                  >
                    <Text
                      size={"sm"}
                      className="text-background"
                      font={"medium"}
                    >
                      Log out from all other sessions
                    </Text>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SessionManagement;
