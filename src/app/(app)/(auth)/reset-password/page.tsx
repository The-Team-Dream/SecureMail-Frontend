"use client";
import { Input } from "@/_components/Input";
import { useResetPassword } from "@/APIs/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { IUpdatePassword, updatePasswordSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import DOMPurify from "dompurify";
import Logo from "@/_components/Logo";
import { Text } from "@/_components/Text";
export default function UpdatePassword() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IUpdatePassword>({
    mode: "onBlur",
    resolver: zodResolver(updatePasswordSchema),
  });
  const router = useRouter();

  const { mutate, isPending } = useResetPassword({
    onSuccess: () => {
      router.push("/sign-in");
      toast.success("Signed in successfully");
    },
    // onError: (err) => {
    //   toast.error(err?.response?.data?.message || "login failed");
    // },
  });

  const onSubmit: SubmitHandler<IUpdatePassword> = (data) => {
    router.push("/sign-in");
    const form = {
      password: DOMPurify.sanitize(data.password),
      confirmPassword: DOMPurify.sanitize(data.confirmPassword),
    };
    mutate(form);
    console.log(form);
  };
  return (
    <div className="relative w-full">
      <div className="absolute top-12 left-1/2 -translate-x-1/2">
        {/* Logo */}
        <Logo />
      </div>
      <div className="min-h-screen max-w-sm lg:max-w-lg w-full mx-auto flex items-center justify-center ">
        {/* Container */}
        <div className="max-w-sm lg:max-w-lg w-full mx-auto">
          <div className="flex flex-col text-center gap-12">
            {/* Text Container */}
            <div className="space-y-8">
              <Text as={"h1"} color={"primary"} font={"semiBold"}>
                Update Password
              </Text>
              <Text color={"secondary"} font={"medium"}>
                Please complete the below data to update your password
              </Text>
            </div>
            <div className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                {/* Input Fields */}
                <div className="flex flex-col gap-4">
                  <Input
                    {...register("password")}
                    isPassword
                    type="password"
                    placeholder="Password"
                    leftIcon={<LockIcon />}
                    error={errors?.password?.message}
                  />
                  <Input
                    {...register("confirmPassword")}
                    isPassword
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
