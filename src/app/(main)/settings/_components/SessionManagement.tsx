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
import {
  useSessions,
  useRevokeSession,
  useRevokeOtherSessions,
} from "@/APIs/hooks/sessions";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { StateMessage } from "@/_components/shared/StateMessage";

const SessionSkeleton = () => (
  <div className="flex flex-col gap-3 w-full mt-6">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="flex items-center justify-between p-4 bg-primary-50 rounded-sm animate-pulse"
      >
        <div className="flex items-center gap-4 w-full">
          <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shrink-0 bg-primary-100" />
          <div className="flex flex-col gap-2 w-full max-w-[200px]">
            <Skeleton className="h-4 w-3/4 bg-primary-100" />
            <Skeleton className="h-3 w-1/2 bg-primary-100" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const SessionManagement = () => {
  const { data: sessions = [], isLoading } = useSessions();
  const { mutate: revokeSession } = useRevokeSession();
  const { mutate: revokeOthers } = useRevokeOtherSessions();

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
              {isLoading ? (
                <SessionSkeleton />
              ) : !Array.isArray(sessions) ? (
                <StateMessage
                  variant="error"
                  title="Session retrieval failed"
                  description="Unable to retrieve sessions. Please try again later."
                  className="h-auto py-10"
                />
              ) : sessions.length === 0 ? (
                <StateMessage
                  variant="empty"
                  title="No active sessions found"
                  description="You are currently logged in on this device only."
                  className="h-auto py-10"
                />
              ) : (
                sessions.map((device) => {
                  const isCurrent = device.isCurrent;
                  // Basic detection for mobile vs desktop
                  const isMobile = /Mobi|Android|iPhone|iPad/i.test(
                    device.deviceOs || device.userAgent || "",
                  );
                  const Icon = isMobile ? Smartphone : Laptop;

                  return (
                    <div
                      key={device.id}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 transition-all duration-300 gap-4 rounded-sm ${isCurrent
                          ? "bg-secondary-50 border-l-4 border-l-secondary-800"
                          : "bg-primary-50"
                        }`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        {/* Icon Container */}
                        <div
                          className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${isCurrent
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
                              className="text-sm sm:text-base truncate capitalize"
                            >
                              {device.deviceBrowser || "Unknown Browser"} on{" "}
                              {device.deviceOs || "Unknown OS"}
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
                            IP: {device.ipAddress}{" "}
                            <span
                              className={
                                isCurrent ? "font-bold" : "font-normal"
                              }
                            >
                              •
                            </span>{" "}
                            {isCurrent
                              ? "Active now"
                              : format(
                                new Date(device.loginAt),
                                "dd MMM yyyy, HH:mm",
                              )}
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
                            onClick={() => revokeSession(device.id)}
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
                })
              )}

              {!isLoading && sessions.length > 1 && (
                <div className="flex justify-end mt-4">
                  <Button
                    type="button"
                    size={"lg"}
                    onClick={() => revokeOthers()}
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
