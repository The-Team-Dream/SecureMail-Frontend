"use client";

import { Input } from "@/_components/shared/Input";
import { useForgetPassword } from "@/APIs/hooks/auth";
import { Button } from "@/components/ui/button";
import {
  forgotPasswordSchema,
  IForgotPassword,
} from "@/schemas/auth/forgotPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Text } from "@/_components/shared/Text";
import { Spinner } from "@/components/ui/spinner";
import { useServerErrors } from "@/utils/form-utils";
import BackEndError from "@/_components/shared/BackEndError";
import forgotPasswordImg from "../../../../public/images/forgot-password.png";

export default function ForgotPassword() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm<IForgotPassword>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: zodResolver(forgotPasswordSchema),
  });
  const { mutate, isPending } = useForgetPassword({
    onSuccess: (res) => {
      toast.success(res.data.message);
    },
    onError: (err) => handleServerErrors(err, ["email"]),
  });
  const { handleServerErrors } = useServerErrors(setError);
  const onSubmit: SubmitHandler<IForgotPassword> = (data) => {
    mutate(data);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Container */}
      <div className="max-w-sm lg:max-w-lg w-full mx-auto">
        {/* Forgot Password Image */}
        <Image
          src={forgotPasswordImg}
          width={350}
          height={350}
          alt="Forgot Password Image"
          className="mx-auto mb-4"
          priority
        />
        <div className="flex flex-col text-center gap-8">
          {/* Text Container */}
          <div className="space-y-4">
            <Text as={"h1"} size={"32"} font={"semiBold"}>
              Forgot your password
            </Text>
            <Text color={"primary-500"} size={"sm"}>
              Enter your email so that we can send you password reset link
            </Text>
          </div>
          <div className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <Input
                {...register("email", {
                  onChange: () => clearErrors(["email", "root" as any]),
                })}
                type="email"
                placeholder="Email Address"
                leftIcon={<Mail />}
                error={errors?.email?.message}
              />
              <BackEndError
                error={
                  errors.root?.message ? String(errors.root.message) : undefined
                }
              />
              <Button
                size={"lg"}
                type="submit"
                disabled={isPending}
                className="w-full"
              >
                {isPending ? (
                  <>
                    <Spinner />
                    <Text className="text-white" font={"medium"}>
                      Sending...
                    </Text>
                  </>
                ) : (
                  <Text className="text-white" font={"medium"}>
                    Send
                  </Text>
                )}
              </Button>
            </form>
            <Link className="hover:underline font-medium" href={"/sign-in"}>
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
