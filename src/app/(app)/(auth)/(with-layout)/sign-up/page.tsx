"use client";
import Cookies from "js-cookie";
import { useSignup } from "@/APIs/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { CircleAlert, LockIcon, Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { errorVariants, Input } from "@/_components/Input";
import Logo from "@/_components/Logo";
import DOMPurify from "dompurify";
import { ISignUp, signupSchema } from "@/schemas/auth";
import { AnimatePresence, motion } from "framer-motion";
export default function Signup() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ISignUp>({
    mode: "onBlur",
    resolver: zodResolver(signupSchema),
  });
  const router = useRouter();

  const signupMutation = useSignup({
    onSuccess: (res) => {
      const token = res?.token;
      if (token) {
        Cookies.set("token", token, { path: "/", expires: 1 });
      }

      toast.success("Signed up successfully");
      router.refresh();
      router.push("/verify-otp");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Signup failed");
    },
  });

  const onSubmit: SubmitHandler<ISignUp> = (data) => {
    const form = {
      fullName: DOMPurify.sanitize(data.fullName),
      email: DOMPurify.sanitize(data.email),
      password: DOMPurify.sanitize(data.password),
      confirmPassword: DOMPurify.sanitize(data.confirmPassword),
      acceptTerms: data.terms,
    };
    console.log(form);
    signupMutation.mutate(form);
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
          <p className="text-textSecondary text-sm xl:text-base">
            Enter your email address and password to log in.
          </p>
        </div>
        {/* Form Input Fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {" "}
          <Input
            type="text"
            placeholder="Full Name"
            leftIcon={<User />}
            {...register("fullName")}
            error={errors.fullName?.message}
          />
          <Input
            type="email"
            placeholder="Email Address"
            leftIcon={<Mail />}
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            type="password"
            isPassword
            placeholder="Password"
            leftIcon={<LockIcon />}
            {...register("password")}
            error={errors.password?.message}
          />
          <Input
            type="password"
            isPassword
            placeholder="Confirm Password"
            leftIcon={<LockIcon />}
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
          <div className="relative">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                id="terms"
                {...register("terms")}
                className="w-4 h-4 accent-[#87BE00]"
              />
              <label htmlFor="terms" className="text-primary font-medium">
                I agree{" "}
                <span className="underline font-bold cursor-pointer">
                  Terms & Conditions
                </span>
              </label>
            </div>
            <AnimatePresence>
              {errors.terms && (
                <motion.div
                  variants={errorVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{
                    ease: "easeInOut",
                    duration: 0.2,
                    stiffness: 120,
                  }}
                  className="flex items-center gap-2 text-error mt-1"
                >
                  <CircleAlert className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {errors.terms.message}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {signupMutation.isError && (
            <p className="text-error">
              {signupMutation.error?.response?.data?.message ||
                "An error occurred"}
            </p>
          )}{" "}
          <Button
            type="submit"
            disabled={signupMutation.isPending}
            size={"lg"}
            className={`w-full rounded-lg hover:bg-primaryHover transition-colors duration-300 ${signupMutation.isPending ? "bg-primary/40" : "bg-primary cursor-pointer"}`}
          >
            {signupMutation.isPending ? "Creating an account" : "Register Now"}
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
              className="border-borderSecondary rounded-xl"
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
              variant={"outline"}
              className="border-borderSecondary rounded-xl"
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
          <div className="text-primary-600 text-center">
            Already have an account?{" "}
            <Link
              className="text-primary font-medium hover:underline"
              href={"/sign-in"}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
