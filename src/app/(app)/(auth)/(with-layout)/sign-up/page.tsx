"use client";
import Cookies from "js-cookie";
import { useOauth, useSignup } from "@/APIs/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { CircleAlert, LockIcon, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { errorVariants, Input } from "@/_components/Input";
import Logo from "@/_components/Logo";
import DOMPurify from "dompurify";
import { ISignUp, signupSchema } from "@/schemas/auth";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { Text } from "@/_components/Text";
import SocialAuthWrapper from "@/_components/SocialAuthWrapper";
export default function Signup() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ISignUp>({
    mode: "onBlur",
    resolver: zodResolver(signupSchema),
  });
  const router = useRouter();

  // Sign up API function
  const signupMutation = useSignup({
    onSuccess: (res) => {
      const token = res?.data.token;
      if (token) {
        Cookies.set("token", token, { path: "/", expires: 1 });
      }
      toast.success("Signed up successfully");
      router.refresh();
      router.push("/verify-otp");
    },
    // onError: (err) => {
    //   toast.error(err?.response?.data?.message || "Signup failed");
    // },
  });

  const onSubmit: SubmitHandler<ISignUp> = (data) => {
    router.push("/verify-otp");
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
      <div className="flex flex-col gap-4">
        <div className="flex justify-center lg:justify-start">
          <Logo />
        </div>
        <div className="space-y-2">
          <Text as={"h1"} color={"primary"} size={"32"}>
            Hello, Welcome back
          </Text>
          <Text color={"secondary"} className="text-sm xl:text-base">
            Enter your email address and password to log in.
          </Text>
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
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                {...register("terms")}
                className="w-4 h-4 accent-[#87BE00] focus:bg-green-500 hover:bg-green-500"
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
          <Button type="submit" disabled={signupMutation.isPending} size={"lg"}>
            {signupMutation.isPending ? "Creating an account" : "Register Now"}
          </Button>
        </form>
        {/* OAuth Buttons */}
        <SocialAuthWrapper />
        <div className="text-primary text-center">
          Already have an account?{" "}
          <Link className="font-medium hover:underline" href={"/sign-in"}>
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
