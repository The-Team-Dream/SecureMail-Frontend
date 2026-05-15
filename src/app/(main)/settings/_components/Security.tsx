"use client";
import { memo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Pencil, X, Save } from "lucide-react";
import { toast } from "sonner";
import { Text } from "@/_components/shared/Text";
import { Input } from "@/_components/shared/Input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ISecurity, securitySchema } from "@/schemas/settings/security";
import { useChangePassword } from "@/APIs/hooks/userSettings";
import { useServerErrors } from "@/utils/form-utils";
import BackEndError from "@/_components/shared/BackEndError";

const TODAY_STRING = new Date().toLocaleDateString(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const Security = memo(() => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword();

  const {
    handleSubmit,
    register,
    reset,
    setError,
    formState: { errors, isDirty },
    clearErrors,
  } = useForm<ISecurity>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(securitySchema),
  });

  const { handleServerErrors } = useServerErrors<ISecurity>(setError);

  const onSubmit: SubmitHandler<ISecurity> = (data: ISecurity) => {
    changePassword(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          toast.success("Changed password successfully");
          setIsEditing(false);
          reset();
        },
        onError: (error) => {
          handleServerErrors(error, [
            "currentPassword",
            "newPassword",
            "confirmPassword",
          ]);
        },
      },
    );
  };

  const handleCancel = () => {
    reset();
    clearErrors();
    setIsEditing(false);
  };

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:no-underline">
          <Text font={"semiBold"} color={"primary-950"} size={"2xl"}>
            Security
          </Text>
        </AccordionTrigger>
        <AccordionContent>
          {/* Change Password Section */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="border border-primary-100 py-6 px-8 rounded-lg mb-6 transition-all">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-start md:items-center gap-2 md:gap-4">
                  <KeyRound className="shrink-0 w-8 h-8 text-primary" />
                  <div>
                    <Text size={"lg"} color={"primary-950"} font="medium">
                      Change Password
                    </Text>
                    <Text
                      color={"primary-600"}
                      className="text-[10px] md:text-sm"
                    >
                      Last changed {TODAY_STRING}
                    </Text>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isChangingPassword}
                  className={`gap-2 transition-all ${isEditing
                      ? "bg-error-500 text-white border-error-200 hover:bg-error-700 group"
                      : "bg-transparent border-primary-100"
                    }`}
                  onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 text-white" />
                      <Text
                        as={"span"}
                        font={"medium"}
                        className="text-white hidden sm:inline"
                      >
                        Cancel Editing
                      </Text>
                    </>
                  ) : (
                    <>
                      <Pencil className="w-4 h-4 text-primary-800" />
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

              {/* Password Form Fields */}
              {isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex flex-col gap-2">
                    <Input
                      label="Current Password"
                      type="password"
                      disabled={isChangingPassword}
                      {...register("currentPassword", {
                        onChange: () => clearErrors(["currentPassword", "root" as any]),
                      })}
                      placeholder="••••••••"
                      error={errors.currentPassword?.message}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Input
                      label="New Password"
                      type="password"
                      disabled={isChangingPassword}
                      {...register("newPassword", {
                        onChange: () => clearErrors(["newPassword", "root" as any]),
                      })}
                      placeholder="••••••••"
                      error={errors.newPassword?.message}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Input
                      label="Confirm Password"
                      type="password"
                      disabled={isChangingPassword}
                      {...register("confirmPassword", {
                        onChange: () => clearErrors(["confirmPassword", "root" as any]),
                      })}
                      placeholder="••••••••"
                      error={errors.confirmPassword?.message}
                    />
                  </div>
                </div>
              )}

              <div className="mt-4">
                <BackEndError
                  error={
                    errors.root?.message
                      ? String(errors.root.message)
                      : undefined
                  }
                />
              </div>

              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <Button
                    type="submit"
                    size={"sm"}
                    disabled={isChangingPassword || !isDirty}
                    className="w-max gap-2 px-6"
                  >
                    {isChangingPassword ? (
                      <>
                        <Spinner />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save New Password
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
});

export default Security;
