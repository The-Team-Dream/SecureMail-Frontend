"use client";
import Container from "@/_components/shared/Container";
import { Input } from "@/_components/shared/Input";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Icons } from "@/constants/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, Bell } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import {
  mailBoxSettingsSchema,
  IMailboxSettings,
} from "@/schemas/mailboxSettings";

const MailboxSettings = () => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    clearErrors,
  } = useForm<IMailboxSettings>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(mailBoxSettingsSchema),
    defaultValues: {
      mailboxName: "Mohamed",
      emailForwarding: true,
      pushNotifications: true,
    },
  });

  const onSubmit = (data: IMailboxSettings) => {
    console.log("Form data:", data);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 pb-20">
        {/* General Section */}
        <section>
          <Text as="h1" font="medium" size="2xl" className="mb-4">
            General
          </Text>
          <div className="border-b border-primary-100 pb-10">
            <Input
              label="Mailbox Name"
              {...register("mailboxName", {
                onChange: () => clearErrors("mailboxName"),
              })}
              placeholder="Mailbox Name"
              type="text"
              className="w-full md:w-[400px]"
              error={errors.mailboxName?.message}
            />
          </div>
        </section>

        {/* Notifications Section */}
        <section>
          <Text as="h2" font="medium" size="2xl" className="mb-6">
            Notifications
          </Text>
          <div className="space-y-6 border-b border-primary-100 pb-10">
            {/* Email Forwarding */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Icons.Mail className="h-5 w-5 text-primary" />
                <div>
                  <Text font="medium" size="lg">
                    Email Forwarding
                  </Text>
                  <Text size="sm" color={"primary-400"}>
                    Forward Summary to backup
                  </Text>
                </div>
              </div>
              <Controller
                name="emailForwarding"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-secondary-500"
                  />
                )}
              />
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <Text font="medium" size="lg">
                    Push Notifications
                  </Text>
                  <Text size="sm" color={"primary-400"}>
                    Alerts on your mobile device
                  </Text>
                </div>
              </div>
              <Controller
                name="pushNotifications"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-secondary-500"
                  />
                )}
              />
            </div>
          </div>
        </section>

        {/* Delete Mailbox Section */}
        <section>
          <Text as="h2" font="medium" size="2xl" className="mb-6">
            Delete Mailbox
          </Text>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-lg bg-error-50 p-2.5 md:p-4">
            <div className="flex items-center gap-3">
              <CircleAlert className="h-5 w-5 text-error-600 shrink-0" />
              <Text size="sm" color={"error-500"} font={"medium"}>
                Once you delete a mailbox, there is no going back. Please be
                certain.
              </Text>
            </div>

            <Button
              type="button"
              className="w-full md:w-auto h-10 px-6 gap-2 rounded-lg border-2 border-error-600 text-error-600 bg-background hover:bg-error-50"
            >
              Delete
              <Icons.Delete className="h-4 w-4 text-error-600" />
            </Button>
          </div>
        </section>

        {/* Footer Action */}
        <div className="flex justify-end pt-4">
          <Button
            size={"lg"}
            type="submit"
            className="w-full md:w-[180px] rounded-lg"
          >
            Save & Update
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default MailboxSettings;
