"use client";
import Cookies from "js-cookie";
import { useSignin } from "@/APIs/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LockIcon, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/_components/shared/Input";
import Logo from "@/_components/shared/Logo";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { ISignin, signinSchema } from "@/schemas/auth/signin";
import toast from "react-hot-toast";
import SocialAuthWrapper from "@/_components/auth/SocialAuthWrapper";
import { Text } from "@/_components/shared/Text";

export default function Signin() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    clearErrors,
  } = useForm<ISignin>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(signinSchema),
  });

  const router = useRouter();
  const signinMutation = useSignin({
    onSuccess: (res) => {
      const token = res?.data?.token;
      if (token) {
        Cookies.set("token", token, { path: "/", expires: 1 });
      }
      toast.success("Signed in successfully");
      reset();
      router.push("/");
    },
    // onError: (err) => {
    //   toast.error(err?.response?.data?.message || "login failed");
    // },
  });

  const onSubmit: SubmitHandler<ISignin> = (data) => {
    signinMutation.mutate(data);
    console.log(data);
    router.push("/");
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-center lg:justify-start">
          <Logo />
        </div>
        <div className="space-y-2">
          <Text as={"h1"} size={"32"}>
            Hello, Welcome back
          </Text>
          <Text color={"primary-500"} className="text-sm lg:text-base">
            Enter your email address and password to log in.
          </Text>
        </div>
        {/* Form Input Fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <Link
            href={"/forgot-password"}
            className="font-medium text-primary hover:underline float-right"
          >
            Forgot Password?
          </Link>
          {signinMutation.isError && (
            <p className="text-error">
              {signinMutation.error?.response?.data?.message ||
                "An error occurred"}
            </p>
          )}
          <Button type="submit" disabled={signinMutation.isPending} size={"lg"}>
            {signinMutation.isPending ? "LOGGING IN..." : "LOGIN"}
          </Button>
        </form>
        {/* OAuth Buttons */}
        <SocialAuthWrapper />
        <div className="text-primary-600 text-center">
          Don&apos;t have an account?{" "}
          <Link
            className="text-primary font-medium hover:underline"
            href={"/sign-up"}
          >
            Registerds
          </Link>
        </div>
      </div>
    </>
  );
}
