"use client";
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
import { Spinner } from "@/components/ui/spinner";
import { handleApiErrors } from "@/utils/form-utils";
export default function Signup() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    clearErrors,
    setError,
    reset,
  } = useForm<ISignUp>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(signupSchema),
  });
  const router = useRouter();

  // Sign up API function
  const signupMutation = useSignup({
    onSuccess: (res, variables) => {
      toast.success(res.data.message);
      reset();
      router.push(`/verify-otp?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? "Signup failed");
    },
  });

  const onSubmit: SubmitHandler<ISignUp> = (data) => {
    const { acceptTerms, ...formData } = data;
    void acceptTerms;
    signupMutation.mutate(formData, {
      onError: (err) => handleApiErrors(err, setError),
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-center lg:justify-start">
          <Logo />
        </div>
        <div className="space-y-2">
          <Text as={"h1"} size={"32"}>
            Create your account
          </Text>
          <Text color={"primary-500"} className="text-sm xl:text-base">
            Please fill the bellow data to create an account
          </Text>
        </div>
        {/* Form Input Fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="text"
            placeholder="Full Name"
            leftIcon={<User />}
            {...register("username", {
              onChange: () => {
                if (errors.username) {
                  clearErrors("username");
                }
              },
            })}
            error={errors.username?.message}
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
                <Text
                  as={"span"}
                  font={"bold"}
                  className="underline cursor-pointer"
                >
                  Terms & Conditions
                </Text>
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

          {errors.root && (
            <div className="p-2 bg-error-500 rounded-lg flex items-start gap-2">
              <CircleAlert className="w-4 h-4 text-error-100" />
              <Text size={"xs"} color={"error-50"} className="text-left">
                {errors.root.message}
              </Text>
            </div>
          )}
          <Button size={"lg"} type="submit" disabled={signupMutation.isPending}>
            {signupMutation.isPending ? (
              <>
                <Spinner />
                <Text className="text-white">Creating Account...</Text>
              </>
            ) : (
              <span>Sign Up</span>
            )}
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
