"use client";
import { Text } from "@/_components/shared/Text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { User, Pencil, Trash2, X, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/_components/shared/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  IPersonalInfo,
  personalInfoSchema,
} from "@/schemas/settings/personalInfo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

const PersonalInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm<IPersonalInfo>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: "MO",
      email: "mohamed@yahoo.com",
      phoneNumber: "(+20)000 000 0000",
    },
  });
  const currentValues = watch();
  const onSubmit: SubmitHandler<IPersonalInfo> = (data: IPersonalInfo) => {
    console.log("Updated Data:", data);
    setIsEditing(false);
  };
  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };
  const [profileImage, setProfileImage] = useState<string | undefined>(
    "https://github.com/shadcn.png",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUpdateClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };
  const handleDeleteImage = () => {
    setProfileImage(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <Text font={"semiBold"} color={"primary-950"} size={"2xl"}>
            Personal Information
          </Text>
        </AccordionTrigger>
        <AccordionContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="border border-primary-100 py-4 px-6 md:py-6 md:px-8 rounded-lg">
              {/* Header Section */}
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-2 md:gap-4">
                  <User className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                  <div>
                    <Text size={"lg"} color={"primary-950"}>
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
                  variant={"outline"}
                  size="sm"
                  className={`gap-2 transition-all ${isEditing ? "bg-error-600 hover:bg-error-700 text-background border-error-600" : "bg-transparent"}`}
                  onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 text-background" />
                      <Text
                        as={"span"}
                        font={"medium"}
                        className="text-background hidden sm:inline"
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

              {/* Profile Picture */}
              <div className="mt-4 flex flex-col gap-4 md:flex-row items-start md:items-center justify-between max-w-md">
                <div className="flex-1">
                  <Text size={"sm"} color={"primary-500"}>
                    Profile Picture
                  </Text>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="flex items-center gap-8 max-w-37.5">
                  <Avatar>
                    <AvatarImage src={profileImage} className="object-cover" />
                    <AvatarFallback className="bg-primary-100 text-primary-800">
                      MO
                    </AvatarFallback>
                  </Avatar>

                  <button
                    type="button"
                    onClick={handleUpdateClick}
                    className="text-info-500 text-sm hover:underline font-medium"
                  >
                    Update
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="flex items-center gap-2 text-sm text-error-500 hover:underline font-medium"
                  >
                    Delete <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <Text size={"sm"} color={"primary-500"}>
                    Full Name
                  </Text>
                  {isEditing ? (
                    <Input
                      {...register("fullName", {
                        onChange: () => {
                          if (errors.fullName) {
                            clearErrors("fullName");
                          }
                        },
                      })}
                      placeholder="Your Name"
                      error={errors.fullName?.message}
                    />
                  ) : (
                    <Text size={"sm"} color={"primary-950"} font={"medium"}>
                      {currentValues.fullName}
                    </Text>
                  )}
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-2">
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
                        },
                      })}
                      placeholder="email@example.com"
                      error={errors.email?.message}
                    />
                  ) : (
                    <Text size={"sm"} color={"primary-950"} font={"medium"}>
                      {currentValues.email}
                    </Text>
                  )}
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-2">
                  <Text size={"sm"} color={"primary-500"}>
                    Phone Number
                  </Text>
                  {isEditing ? (
                    <Input
                      {...register("phoneNumber", {
                        onChange: () => {
                          if (errors.phoneNumber) {
                            clearErrors("phoneNumber");
                          }
                        },
                      })}
                      placeholder="20+....."
                      error={errors.phoneNumber?.message}
                    />
                  ) : (
                    <Text size={"sm"} color={"primary-950"} font={"medium"}>
                      {currentValues.phoneNumber}
                    </Text>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <Button type="submit" className="bg-primary text-background">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PersonalInfo;
