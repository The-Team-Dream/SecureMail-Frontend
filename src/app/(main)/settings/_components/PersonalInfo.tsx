"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, X, Save, Loader2, UserRound } from "lucide-react";
import { Text } from "@/_components/shared/Text";
import { Input } from "@/_components/shared/Input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  IPersonalInfo,
  personalInfoSchema,
} from "@/schemas/settings/personalInfo";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateProfile } from "@/APIs/hooks/userSettings";
import { Icons } from "@/constants/icons";
import { useGetAuthMe } from "@/APIs/hooks/auth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";
import { PersonalInfoSkeleton } from "@/_components/skeleton/PersonalInfoSkeleton";

const PersonalInfo = () => {
  const { data: user, isLoading } = useGetAuthMe();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeletingImg, setIsDeletingImg] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>(
    user?.user?.avatar || undefined,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, isDirty },
    clearErrors,
  } = useForm<IPersonalInfo>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      username: user?.user?.username ?? "",
      email: user?.user?.email ?? "",
    },
  });

  // Sync form values once the user data loads
  useEffect(() => {
    if (user) {
      reset({
        username: user.user.username,
        email: user.user.email,
      });
      if (user.user.avatar) {
        setProfileImage(user.user.avatar);
      } else {
        setProfileImage(undefined);
      }
      setSelectedFile(null);
    }
  }, [user, reset]);

  const currentValues = watch();

  const onSubmit: SubmitHandler<IPersonalInfo> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      // Append avatar file if a new one was selected (actual File object, NOT a URL)
      if (selectedFile) formData.append("avatar", selectedFile);

      await new Promise<void>((resolve, reject) =>
        updateProfile(formData, {
          onSuccess: () => resolve(),
          onError: (e) => reject(e),
        }),
      );

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setSelectedFile(null);
    } catch (error: any) {
      const serverMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        JSON.stringify(error?.response?.data) ||
        "Update failed. Please try again.";
      console.error("[ProfileUpdate] Error:", error?.response?.data ?? error);
      toast.error(serverMsg);
    }
  };

  const handleCancel = () => {
    reset();
    clearErrors();
    setIsEditing(false);
    setSelectedFile(null);
    setProfileImage(user?.user?.avatar || undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setSelectedFile(file);
    }
  };

  const handleDeleteImage = async () => {
    setIsDeletingImg(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setProfileImage(undefined);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setIsDeletingImg(false);
    }
  };

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:no-underline">
          <Text font={"semiBold"} color={"primary-950"} size={"2xl"}>
            Personal Information
          </Text>
        </AccordionTrigger>
        <AccordionContent>
          {isLoading ? (
            <PersonalInfoSkeleton />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="border border-primary-100 py-4 px-6 md:py-6 md:px-8 rounded-lg">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-2 md:gap-4">
                    <UserRound className="shrink-0 w-8 h-8 text-primary" />
                    <div>
                      <Text size={"lg"} color={"primary-950"} font="medium">
                        Profile
                      </Text>
                      <Text
                        color={"primary-600"}
                        className="text-[10px] md:text-sm"
                      >
                        Update your name and profile photo
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
                    onClick={
                      isEditing ? handleCancel : () => setIsEditing(true)
                    }
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

                {/* Profile Picture */}
                <div className="mt-4 flex flex-col gap-4 md:flex-row items-start md:items-center justify-between max-w-md">
                  <Text size={"sm"} color={"primary-500"}>
                    Profile Picture
                  </Text>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  <div className="flex items-center gap-6">
                    <Avatar
                      className={`w-16 h-16 ${isDeletingImg ? "opacity-40" : ""}`}
                    >
                      <AvatarImage
                        src={profileImage}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary-100 text-primary-800">
                        {getInitials(currentValues.username || "")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        disabled={!isEditing || isUpdating || isDeletingImg}
                        onClick={handleUpdateClick}
                        className="text-info-600 text-sm hover:underline font-medium disabled:text-primary-400 disabled:cursor-not-allowed"
                      >
                        Update
                      </button>

                      <button
                        type="button"
                        disabled={!isEditing || isUpdating || isDeletingImg}
                        onClick={handleDeleteImage}
                        className="flex items-center gap-1 text-sm text-error-500 hover:underline font-medium disabled:text-primary-400 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isDeletingImg ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            Delete{" "}
                            <Icons.Delete className="w-4 h-4 text-error-500" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1">
                    <Text size={"sm"} color={"primary-500"}>
                      Full Name
                    </Text>
                    {isEditing ? (
                      <Input
                        {...register("username", {
                          onChange: () => {
                            if (errors.username) {
                              clearErrors("username");
                            }
                          }
                        })}
                        placeholder="Your Name"
                        error={errors.username?.message}
                        disabled={isUpdating}
                      />
                    ) : (
                      <Text size={"sm"} color={"primary-950"} font={"medium"}>
                        {currentValues.username}
                      </Text>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1">
                    <Text size={"sm"} color={"primary-500"}>
                      Email address
                    </Text>
                    {isEditing ? (
                      <Input
                        {...register("email", {
                          onChange: () => {
                            if (errors.email) {
                              clearErrors("email");
                            }
                          }
                        })}
                        placeholder="email@example.com"
                        error={errors.email?.message}
                        disabled={true}
                      />
                    ) : (
                      <Text size={"sm"} color={"primary-950"} font={"medium"}>
                        {currentValues.email}
                      </Text>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-8 flex justify-end">
                    <Button
                      type="submit"
                      size={"sm"}
                      disabled={
                        isUpdating ||
                        (!isDirty &&
                          !selectedFile &&
                          profileImage === user?.user?.avatar)
                      }
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
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </form>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PersonalInfo;
