"use client";
import Cookies from "js-cookie";
import { useSignin } from "@/APIs/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LockIcon, Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
const signupSchema = z
  .object({
    fullName: z.string().min(1, { message: "Full name is required" }),
    email: z.string().min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password does not match",
  });
export default function Signup() {
  const {
    handleSubmit,
    register,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<ISignUp>({
    mode: "onBlur",
    resolver: zodResolver(signupSchema),
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fullName = watch("fullName") || "";

  type ISignUp = z.infer<typeof signupSchema>;

  const signinMutation = useSignin({
    onSuccess: (res) => {
      const token = res?.data?.token;
      if (token) Cookies.set("token", token);

      toast.success("Signed up successfully");
      router.push("/");
    },
    onError: (err) => {
      const errors = err?.response?.data?.errors;

      if (errors) {
        Object.entries(errors).forEach(([key, value]) => {
          setError(key as keyof ISignUp, {
            type: "server",
            message: value as string,
          });
        });
      } else {
        toast.error(err?.response?.data?.message || "Signup failed");
      }
    },
  });
  const isDisabled = signinMutation.isPending || fullName.length < 3;

  const onSubmit: SubmitHandler<ISignUp> = ({ fullName, email, password }) => {
    const form = { fullName, email, password };
    signinMutation.mutate(form);
    reset();
  };

  return (
    <div className="bg-bgPrimary">
      {/* Form Container */}
      <div className="flex flex-col text-center lg:text-left gap-6">
        <Image
          src={"/icons/logo_Dark.png"}
          alt="Logo"
          width={200}
          height={200}
          className="cursor-pointer mx-auto lg:mx-0"
        />
        <div className="space-y-3">
          <h3 className="text-3xl text-primary font-normal">
            Hello, Welcome back
          </h3>
          <p className="text-textSecondary text-base font-normal">
            Enter your email address and password to log in.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {" "}
          <div className="flex items-center gap-0.5 px-4 h-12 py-4 border border-border rounded-lg overflow-hidden">
            <User className="text-textMuted" />
            <Input
              {...register("fullName")}
              type="text"
              className="h-full w-full border-none"
              placeholder="Full Name"
            />
          </div>
          {errors.fullName && (
            <p className="text-textMuted text-left">
              {errors.fullName.message}
            </p>
          )}
          <div className="flex items-center gap-0.5 px-4 h-12 py-4 border border-border rounded-lg overflow-hidden text-textMuted">
            <Mail className="text-textMuted" />
            <Input
              {...register("email")}
              type="text"
              className="h-full w-full border-none"
              placeholder="Email Address"
            />
          </div>
          {errors.email && (
            <p className="text-destructive text-left">{errors.email.message}</p>
          )}
          <div className="flex items-center gap-0.5 px-4 h-12 py-4 border border-border rounded-lg overflow-hidden">
            <LockIcon className="text-textMuted" />
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="flex-1 h-full border-none "
              placeholder="Password"
            />
            {showPassword ? (
              <EyeOff
                className="text-textMuted w-5 h-5 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <Eye
                className="text-textMuted w-5 h-5 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          {errors.password && (
            <p className="text-destructive text-left">
              {errors.password.message}
            </p>
          )}
          <div className="flex items-center gap-0.5 px-4 h-12 py-4 border border-border rounded-lg overflow-hidden">
            <LockIcon className="text-textMuted" />
            <Input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              className="flex-1 h-full border-none"
              placeholder="Confirm Password"
            />
            {showConfirmPassword ? (
              <EyeOff
                className="text-textMuted w-5 h-5 cursor-pointer"
                onClick={() => setShowConfirmPassword(false)}
              />
            ) : (
              <Eye
                className="text-textMuted w-5 h-5 cursor-pointer"
                onClick={() => setShowConfirmPassword(true)}
              />
            )}
          </div>
          {errors.confirmPassword && (
            <p className="text-destructive text-left">
              {errors.confirmPassword.message}
            </p>
          )}
          {signinMutation.isError && (
            <p className="text-destructive">
              {signinMutation.error?.response?.data?.message ||
                "An error occurred"}
            </p>
          )}{" "}
          <Button
            type="submit"
            disabled={isDisabled}
            size={"lg"}
            className={`w-full rounded-lg hover:bg-primaryHover transition-colors duration-300 ${isDisabled ? "bg-primary/50" : "bg-primary cursor-pointer"}`}
          >
            {signinMutation.isPending ? "Creating an account" : "Register Now"}
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-borderSecondary" />
            <span className="text-center text-borderSecondary">Or</span>
            <div className="flex-1 h-px bg-borderSecondary" />
          </div>
          <div className="flex items-center justify-between">
            <Button
              size={"lg"}
              className="w-[45%] bg-transparent border border-borderSecondary rounded-xl"
            >
              <Image
                src={"/icons/google.svg"}
                width={30}
                height={30}
                alt="google"
              />
              <span className="text-primary font-medium">Google</span>
            </Button>
            <Button
              size={"lg"}
              className="w-[45%] bg-transparent border border-borderSecondary rounded-xl"
            >
              <Image
                src={"/icons/outlook.svg"}
                width={30}
                height={30}
                alt="Outlook Icon"
              />
              <span className="text-primary font-medium">Outlook</span>
            </Button>
          </div>
          <div className="text-primary-600 font-medium text-center">
            Already have an account?{" "}
            <Link className="text-primary hover:underline" href={"/sign-in"}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
