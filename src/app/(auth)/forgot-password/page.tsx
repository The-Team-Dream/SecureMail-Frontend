"use client";
import { Input } from "@/_components/shared/Input";
import { useForgetPassword } from "@/APIs/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { forgotPasswordSchema, IForgotPassword } from "@/schemas/auth/forgotPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Text } from "@/_components/shared/Text";
export default function ForgotPassword() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    clearErrors,
  } = useForm<IForgotPassword>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(forgotPasswordSchema),
  });
  const router = useRouter();

  const { mutate, isPending } = useForgetPassword({
    onSuccess: () => {
      router.push("/reset-password");
      toast.success("Signed in successfully");
    },
    // onError: (err) => {
    //   toast.error(err?.response?.data?.message || "login failed");
    // },
  });

  const onSubmit: SubmitHandler<IForgotPassword> = (data) => {
    mutate(data);
    console.log(data);

    router.push("/reset-password");
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Container */}
      <div className="max-w-sm lg:max-w-lg w-full mx-auto">
        {/* Forgot Password Image */}
        <Image
          src={"/images/forgot-password.jpg"}
          width={350}
          height={350}
          alt="Forgot Password Image"
          className="mx-auto mb-4"
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
                  onChange: () => {
                    if (errors.email) {
                      clearErrors("email");
                    }
                  },
                })}
                type="email"
                placeholder="Email Address"
                leftIcon={<Mail />}
                error={errors?.email?.message}
              />
              <Button size={"lg"} type="submit" disabled={isPending}>
                Send
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
