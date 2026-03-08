"use client";
import Cookies from "js-cookie";
import { useSignin } from "@/APIs/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LockIcon, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/_components/Input";
import Logo from "@/_components/Logo";
import DOMPurify from "dompurify";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { ISignin, signinSchema } from "@/schemas/auth";
import toast from "react-hot-toast";
import { Text } from "@/_components/Text";
import SocialAuthWrapper from "@/_components/SocialAuthWrapper";

export default function Signin() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ISignin>({
    mode: "onBlur",
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
      router.refresh();
      router.push("/");
    },
    // onError: (err) => {
    //   toast.error(err?.response?.data?.message || "login failed");
    // },
  });

  const onSubmit: SubmitHandler<ISignin> = async (data) => {
    router.push("/");
    const sanitizedForm = {
      email: DOMPurify.sanitize(data.email),
      password: DOMPurify.sanitize(data.password),
    };
    signinMutation.mutate(sanitizedForm);
    console.log(sanitizedForm);
    reset();
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-center lg:justify-start">
          <Logo />
        </div>
        <div className="space-y-2">
          <Text as={"h1"} color={"primary"} size={"32"}>
            Hello, Welcome back
          </Text>
          <Text color={"secondary"} className="text-sm lg:text-base">
            Enter your email address and password to log in.
          </Text>
        </div>
        {/* Form Input Fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {" "}
          <Input
            {...register("email")}
            type="email"
            placeholder="Email Address"
            leftIcon={<Mail />}
            error={errors?.email?.message}
          />
          <Input
            {...register("password")}
            type="password"
            placeholder="Password"
            isPassword
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
        <div className="text-primary text-center">
          Don&apos;t have an account?{" "}
          <Link
            className="text-primary font-medium hover:underline"
            href={"/sign-up"}
          >
            Register
          </Link>
        </div>
      </div>
    </>
  );
}
