"use client";
import { Input } from "@/_components/shared/Input";
import { useResetPassword } from "@/APIs/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  IResetPasswordSchema,
  resetPasswordSchema,
} from "@/schemas/auth/resetPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Logo from "@/_components/shared/Logo";
import { Text } from "@/_components/shared/Text";
export default function ResetPassword() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    clearErrors,
  } = useForm<IResetPasswordSchema>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(resetPasswordSchema),
  });
  const router = useRouter();

  const { mutate, isPending } = useResetPassword({
    onSuccess: () => {
      toast.success("Signed in successfully");
      router.push("/sign-in");
    },
    // onError: (err) => {
    //   toast.error(err?.response?.data?.message || "login failed");
    // },
  });

  const onSubmit: SubmitHandler<IResetPasswordSchema> = (data) => {
    mutate(data);
    console.log(data);
    router.push("/sign-in");
  };
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
                Update Password
              </Text>
              <Text color={"primary-500"} font={"medium"}>
                Please complete the below data to update your password
              </Text>
            </div>
            <div className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                {/* Input Fields */}
                <div className="flex flex-col gap-4">
                  <Input
                    {...register("password", {
                      onChange: () => {
                        if (errors.password) {
                          clearErrors("password");
                        }
                      },
                    })}
                    type="password"
                    placeholder="Password"
                    leftIcon={<LockIcon />}
                    error={errors?.password?.message}
                  />
                  <Input
                    {...register("confirmPassword", {
                      onChange: () => {
                        if (errors.confirmPassword) {
                          clearErrors("confirmPassword");
                        }
                      },
                    })}
                    type="password"
                    placeholder="Confirm Password"
                    leftIcon={<LockIcon />}
                    error={errors?.confirmPassword?.message}
                  />
                </div>
                <Button size={"lg"} type="submit" disabled={isPending}>
                  Update
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
