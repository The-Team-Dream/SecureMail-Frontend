"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Pencil, Shield, ChevronRight, X, Save } from "lucide-react";

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

const Security = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isDirty },
    clearErrors,
  } = useForm<ISecurity>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(securitySchema),
  });

  const onSubmit: SubmitHandler<ISecurity> = async (data: ISecurity) => {
    setIsUpdating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Password Updated Successfully:", data);
      setIsEditing(false);
      reset();
    } catch (error) {
      console.error("Password change failed:", error);
    } finally {
      setIsUpdating(false);
    }
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
                  <div className="bg-primary-50 p-2 rounded-full">
                    <KeyRound className="shrink-0 w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <Text size={"lg"} color={"primary-950"} font="medium">
                      Change Password
                    </Text>
                    <Text
                      color={"primary-600"}
                      className="text-[10px] md:text-sm"
                    >
                      Last changed 3 months ago
                    </Text>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  className={`gap-2 transition-all ${
                    isEditing
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
                      disabled={isUpdating}
                      {...register("currentPassword", {
                        onChange: () => {
                          if (errors.currentPassword) {
                            clearErrors("currentPassword");
                          }
                        },
                      })}
                      placeholder="••••••••"
                      error={errors.currentPassword?.message}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Input
                      label="New Password"
                      type="password"
                      disabled={isUpdating}
                      {...register("newPassword", {
                        onChange: () => {
                          if (errors.newPassword) {
                            clearErrors("newPassword");
                          }
                        },
                      })}
                      placeholder="••••••••"
                      error={errors.newPassword?.message}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Input
                      label="Confirm Password"
                      type="password"
                      disabled={isUpdating}
                      {...register("confirmPassword", {
                        onChange: () => {
                          if (errors.confirmPassword) {
                            clearErrors("confirmPassword");
                          }
                        },
                      })}
                      placeholder="••••••••"
                      error={errors.confirmPassword?.message}
                    />
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <Button
                    type="submit"
                    size={"sm"}
                    disabled={isUpdating || !isDirty}
                    className="w-max gap-2 px-6"
                  >
                    {isUpdating ? (
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

          {/* Two-Factor Section */}
          <div className="border border-primary-100 py-6 px-8 rounded-lg transition-all hover:bg-primary-50/30 cursor-pointer group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary-50 p-2 rounded-full group-hover:bg-white transition-colors">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <Text color={"primary-950"} font={"medium"}>
                    Two-Factor auth
                  </Text>
                  <Text color={"primary-500"} size={"sm"}>
                    Enhanced account protection
                  </Text>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-primary transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Security;
