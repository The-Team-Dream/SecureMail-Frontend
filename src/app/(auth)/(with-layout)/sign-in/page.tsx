"use client";
import Cookies from "js-cookie";
import { useSignin } from "@/APIs/hooks/auth";
import { Button } from "@/components/ui/button";
import { LockIcon, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/_components/shared/Input";
import Logo from "@/_components/shared/Logo";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { ISignin, signinSchema } from "@/schemas/auth/signin";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const SocialAuthWrapper = dynamic(
  () => import("@/_components/auth/SocialAuthWrapper"),
);
import { Text } from "@/_components/shared/Text";
import { Spinner } from "@/components/ui/spinner";
import BackEndError from "@/_components/shared/BackEndError";
import { useServerErrors } from "@/utils/form-utils";

const SignIn = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<ISignin>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(signinSchema),
  });
  const { handleServerErrors } = useServerErrors<ISignin>(setError);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/mailboxes";

  const signinMutation = useSignin({
    onSuccess: (res) => {
      const token = res?.data.token;
      if (token) {
        Cookies.set("token", token, { path: "/", expires: 1 });
      }
      toast.success("Logged in successfully");
      reset();
      // router.push(callbackUrl);
      window.location.href = callbackUrl;
    },
    onError: (err) => handleServerErrors(err, ["email", "password"]),
  });

  const onSubmit: SubmitHandler<ISignin> = (data) => {
    signinMutation.mutate(data);
  };

  return (
    <div className="flex flex-col gap-8">
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          {...register("email", {
            onChange: () => clearErrors(["email", "root" as any]),
          })}
          type="email"
          placeholder="Email Address"
          leftIcon={<Mail />}
          error={errors?.email?.message}
        />
        <Input
          {...register("password", {
            onChange: () => clearErrors(["password", "root" as any]),
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
        <BackEndError
          error={errors.root?.message ? String(errors.root.message) : undefined}
        />
        <Button
          size={"lg"}
          type="submit"
          disabled={signinMutation.isPending}
          className="w-full"
        >
          {signinMutation.isPending ? (
            <>
              <Spinner />
              <Text font={"medium"} className="text-white">
                Logging in...
              </Text>
            </>
          ) : (
            <Text font={"medium"} className="text-white">
              Login
            </Text>
          )}
        </Button>
      </form>
      <SocialAuthWrapper />
      <div className="text-primary-600 text-center">
        Don&apos;t have an account?{" "}
        <Link
          className="text-primary font-medium hover:underline"
          href={"/sign-up"}
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
