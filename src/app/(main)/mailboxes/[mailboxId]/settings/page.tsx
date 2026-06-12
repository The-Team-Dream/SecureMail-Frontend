"use client";
"use no memo";
import Container from "@/_components/shared/Container";
import { FancySpinner } from "@/_components/shared/FancySpinner";
import { Input } from "@/_components/shared/Input";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Icons } from "@/constants/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, Bell } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import {
  mailBoxSettingsSchema,
  IMailboxSettings,
} from "@/schemas/mailboxSettings";
import { useParams, useRouter } from "next/navigation";
import {
  useMailboxById,
  useUpdateMailbox,
  useDeleteMailbox,
} from "@/APIs/hooks/mailboxes";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmationModal } from "@/_components/shared/ConfirmationModal";
import { useState, useEffect } from "react";
import { useServerErrors } from "@/utils/form-utils";
import BackEndError from "@/_components/shared/BackEndError";
import { toast } from "sonner";

const MailboxSettings = () => {
  const params = useParams();
  const router = useRouter();
  const mailboxId = params.mailboxId as string;

  const { data: mailbox, isLoading } = useMailboxById(mailboxId);
  useEffect(() => {
    console.log("Mailbox data updated:", mailbox);
  }, [mailbox]);
  const { mutate: updateMailbox, isPending: isUpdating } = useUpdateMailbox();
  const { mutate: deleteMailbox, isPending: isDeleting } = useDeleteMailbox();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm<IMailboxSettings>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(mailBoxSettingsSchema),
    defaultValues: {
      mailboxName: mailbox?.displayName || "",
      pushNotifications: mailbox?.pushNotificationsEnabled ?? true,
    },
  });
  const { handleServerErrors } = useServerErrors<IMailboxSettings>(setError);

  useEffect(() => {
    if (mailbox && !isLoading) {
      reset({
        mailboxName: mailbox.displayName.trim() || "",
        pushNotifications: mailbox.pushNotificationsEnabled,
      });
    }
  }, [mailbox, isLoading, reset]);

  const onSubmit = (data: IMailboxSettings) => {
    console.log("Data from Form:", data.mailboxName);
    if (!mailboxId) {
      console.error("Mailbox ID is missing!");
      return;
    }
    updateMailbox(
      {
        id: mailboxId,
        data: {
          displayName: data.mailboxName,
          pushNotificationsEnabled: data.pushNotifications,
        },
      },
      {
        onError: (err) =>
          handleServerErrors(err, ["mailboxName", "pushNotifications"]),
      },
    );
  };

  const handleDelete = () => {
    deleteMailbox(mailboxId, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        router.push("/mailboxes");
      },
    });
  };

  if (isLoading) {
    return <FancySpinner text="Loading Settings..." />;
  }

  return (
    <Container>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 400,
          damping: 20,
        }}
        key={mailboxId}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-10 pb-20"
      >
        {/* General Section */}
        <section>
          <Text as="h1" font="medium" size="2xl" className="mb-4">
            General
          </Text>
          <div className="border-b border-primary-100 pb-10 space-y-6">
            <Input
              label="Mailbox Name"
              {...register("mailboxName", {
                onChange: () => clearErrors("mailboxName"),
              })}
              placeholder={"Mailbox Name"}
              type="text"
              className="w-full md:w-[400px]"
              error={errors.mailboxName?.message}
            />
            <BackEndError error={errors.root?.message} />
          </div>
        </section>

        {/* Notifications Section */}
        <section>
          <Text as="h2" font="medium" size="2xl" className="mb-6">
            Notifications
          </Text>
          <div className="space-y-6 border-b border-primary-100 pb-10">
            {/* Email Forwarding */}
            {/* <div className="flex items-center justify-between">
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
                    className="data-[state=checked]:bg-primary"
                  />
                )}
              />
            </div> */}

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
                    className="data-[state=checked]:bg-primary"
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
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isDeleting}
              className="w-full md:w-auto h-10 px-6 gap-2 rounded-lg border-2 border-error-600 text-error-600 bg-background hover:bg-error-50"
            >
              {isDeleting ? (
                <>
                  <Spinner className="w-4 h-4" /> Deleting...
                </>
              ) : (
                <>
                  Delete <Icons.Delete className="h-4 w-4 text-error-600" />
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          variant="danger"
          title="Delete Mailbox"
          description="Are you sure you want to delete this mailbox? This action cannot be undone and you will lose all associated data."
          confirmText="Delete Mailbox"
        />

        {/* Footer Action */}
        <div className="flex justify-end pt-4">
          <Button
            size={"lg"}
            type="submit"
            disabled={isUpdating || isLoading || !mailboxId}
            className="w-full md:w-[180px] rounded-lg gap-2"
          >
            {isUpdating ? (
              <>
                <Spinner className="w-4 h-4" /> Updating...
              </>
            ) : (
              "Save & Update"
            )}
          </Button>
        </div>
      </motion.form>
    </Container>
  );
};

export default MailboxSettings;
