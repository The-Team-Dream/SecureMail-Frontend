"use client";
import { Input } from "@/_components/shared/Input";
import { Suspense, useEffect } from "react";
import { useResetPassword } from "@/APIs/hooks/auth";
import { Button } from "@/components/ui/button";
import {
  IResetPasswordSchema,
  resetPasswordSchema,
} from "@/schemas/auth/resetPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import Logo from "@/_components/shared/Logo";
import { Text } from "@/_components/shared/Text";
import { Spinner } from "@/components/ui/spinner";
import { useServerErrors } from "@/utils/form-utils";
import BackEndError from "@/_components/shared/BackEndError";
export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Reset token is missing. Please check your email link.");
      router.replace("/forgot-password");
    }
  }, [token, router]);

  const {
    handleSubmit,
    register,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm<IResetPasswordSchema>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(resetPasswordSchema),
  });
  const { handleServerErrors } =
    useServerErrors<IResetPasswordSchema>(setError);

  const { mutate, isPending } = useResetPassword({
    onSuccess: (res) => {
      toast.success(res.data.message);
      router.push("/sign-in");
    },
    onError: (err) =>
      handleServerErrors(err, ["newPassword", "confirmPassword"]),
  });

  const onSubmit: SubmitHandler<IResetPasswordSchema> = (data) => {
    if (!token) {
      toast.error("Reset token is missing. Please check your email link.");
      return;
    }
    mutate({
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
      resetPasswordToken: token,
    });
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="relative w-full">
      {/* Logo */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2">
        <Logo />
      </div>
      <div className="min-h-screen max-w-sm lg:max-w-lg w-full mx-auto flex items-center justify-center">
        {/* Container */}
        <div className="max-w-sm lg:max-w-lg w-full mx-auto">
          <div className="flex flex-col text-center gap-12">
            {/* Text Container */}
            <div className="space-y-8">
              <Text as={"h1"} font={"semiBold"} size={"2xl"}>
                Reset Password
              </Text>
              <Text color={"primary-500"} font={"medium"}>
                Please complete the below data to reset your password
              </Text>
            </div>
            <div className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                {/* Input Fields */}
                <div className="flex flex-col gap-4">
                  <Input
                    {...register("newPassword", {
                      onChange: () => clearErrors(["newPassword", "root" as any]),
                    })}
                    type="password"
                    placeholder="New Password"
                    leftIcon={<LockIcon />}
                    error={errors?.newPassword?.message}
                  />
                  <Input
                    {...register("confirmPassword", {
                      onChange: () => clearErrors(["confirmPassword", "root" as any]),
                    })}
                    type="password"
                    placeholder="Confirm Password"
                    leftIcon={<LockIcon />}
                    error={errors?.confirmPassword?.message}
                  />
                </div>
                <BackEndError
                  error={
                    errors.root?.message
                      ? String(errors.root.message)
                      : undefined
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
                        Resetting...
                      </Text>
                    </>
                  ) : (
                    <Text className="text-white" font={"medium"}>
                      Reset Password
                    </Text>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
