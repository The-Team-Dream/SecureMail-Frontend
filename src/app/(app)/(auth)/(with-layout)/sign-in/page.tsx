"use client";
import Cookies from "js-cookie";
import { useSignin } from "@/APIs/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LockIcon, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/_components/Input";
import Logo from "@/_components/Logo";
import DOMPurify from "dompurify";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { ISignin, signinSchema } from "@/schemas/auth";

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
      const token = res?.token;
      if (token) {
        Cookies.set("token", token, { path: "/", expires: 1 });
      }
      toast.success("Signed in successfully");
      router.refresh();
      router.push("/");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "login failed");
    },
  });

  const onSubmit: SubmitHandler<ISignin> = async (data) => {
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
          <h3 className="text-3xl text-primary">Hello, Welcome back</h3>
          <p className="tex-sm lg:text-base text-textSecondary">
            Enter your email address and password to log in.
          </p>
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
          <Button
            type="submit"
            disabled={signinMutation.isPending}
            size={"lg"}
            className={`w-full ${signinMutation.isPending ? "bg-primary/60" : "bg-primary"}`}
          >
            {signinMutation.isPending ? "LOGGING IN..." : "LOGIN"}
          </Button>
        </form>
        {/* OAuth Buttons */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-borderSecondary" />
            <span className="text-center text-borderSecondary">Or</span>
            <div className="flex-1 h-px bg-borderSecondary" />
          </div>
          <div className="grid grid-cols-2 gap-6 md:gap-12">
            <Button
              size={"lg"}
              variant={"outline"}
              className=" bg-transparent border border-borderSecondary rounded-xl"
            >
              <Image
                src={"/icons/google.svg"}
                width={30}
                height={30}
                alt="google"
              />
              <span className="text-primary">Google</span>
            </Button>
            <Button
              size={"lg"}
              variant={"outline"}
              className="bg-transparent border border-borderSecondary rounded-xl"
            >
              <Image
                src={"/icons/outlook.svg"}
                width={30}
                height={30}
                alt="Outlook Icon"
              />
              <span className="text-primary">Outlook</span>
            </Button>
          </div>
          <div className="text-primary-600 text-center">
            Already have an account?{" "}
            <Link
              className="text-primary font-medium hover:underline"
              href={"/sign-up"}
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
