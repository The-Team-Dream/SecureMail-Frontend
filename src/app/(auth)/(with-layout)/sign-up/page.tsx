"use client";
import Cookies from "js-cookie";
import { useSignup } from "@/APIs/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { CircleAlert, LockIcon, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { errorVariants, Input } from "@/_components/shared/Input";
import Logo from "@/_components/shared/Logo";
import { ISignUp, signupSchema } from "@/schemas/auth/signup";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { Text } from "@/_components/shared/Text";
import SocialAuthWrapper from "@/_components/auth/SocialAuthWrapper";
export default function Signup() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    clearErrors,
    reset,
    trigger,
  } = useForm<ISignUp>({
    mode: "onBlur",
    reValidateMode: "onChange",
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
      reset();
      router.push("/verify-otp");
    },
    // onError: (err) => {
    //   toast.error(err?.response?.data?.message || "Signup failed");
    // },
  });

  const onSubmit: SubmitHandler<ISignUp> = (data) => {
    console.log(data);
    signupMutation.mutate(data);
    router.push("/verify-otp");
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-center lg:justify-start">
          <Logo />
        </div>
        <div className="space-y-2">
          <Text as={"h1"} size={"32"}>
            Hello, Welcome back
          </Text>
          <Text color={"primary-500"} className="text-sm xl:text-base">
            Enter your email address and password to log in.
          </Text>
        </div>
        {/* Form Input Fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="text"
            placeholder="Full Name"
            leftIcon={<User />}
            {...register("fullName", {
              onChange: () => {
                if (errors.fullName) {
                  clearErrors("fullName");
                }
                trigger("confirmPassword");
              },
            })}
            error={errors.fullName?.message}
          />
          <Input
            type="email"
            placeholder="Email Address"
            leftIcon={<Mail />}
            {...register("email", {
              onChange: () => {
                if (errors.email) {
                  clearErrors("email");
                }
              },
            })}
            error={errors.email?.message}
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
          {/* Checkbox */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                {...register("acceptTerms", {
                  onChange: () => {
                    if (errors.acceptTerms) {
                      clearErrors("acceptTerms");
                    }
                  },
                })}
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
              {errors.acceptTerms && (
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
                  <Text as={"span"} font={"medium"} size={"sm"} color={"error"}>
                    {errors.acceptTerms.message}
                  </Text>
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
        <div className="text-primary-600 text-center">
          Already have an account?{" "}
          <Link
            className="font-medium hover:underline text-primary"
            href={"/sign-in"}
          >
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
