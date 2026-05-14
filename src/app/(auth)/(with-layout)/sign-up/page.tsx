"use client";
import { useSignup } from "@/APIs/hooks/auth";
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
import { toast } from "sonner";
import { Text } from "@/_components/shared/Text";
import dynamic from "next/dynamic";

const SocialAuthWrapper = dynamic(
  () => import("@/_components/auth/SocialAuthWrapper"),
);
import { Spinner } from "@/components/ui/spinner";
import { useServerErrors } from "@/utils/form-utils";
import BackEndError from "@/_components/shared/BackEndError";
import Error from "@/_components/shared/Error";
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
    reValidateMode: "onBlur",
    resolver: zodResolver(signupSchema),
  });
  const router = useRouter();
  const { handleServerErrors } = useServerErrors<ISignUp>(setError);

  // Sign up API function
  const signupMutation = useSignup({
    onSuccess: (res, variables) => {
      console.log(res);
      toast.success("Account created successfully");
      reset();
      router.push(`/verify-otp?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (err: any) =>
      handleServerErrors(err, [
        "username",
        "email",
        "password",
        "confirmPassword",
      ]),
  });

  const onSubmit: SubmitHandler<ISignUp> = (data) => {
    const { acceptTerms, ...formData } = data;
    void acceptTerms;
    signupMutation.mutate(formData);
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
              onChange: () => clearErrors(["username", "root" as any]),
            })}
            error={errors.username?.message}
          />
          <Input
            type="email"
            placeholder="Email Address"
            leftIcon={<Mail />}
            {...register("email", {
              onChange: () => clearErrors(["email", "root" as any]),
            })}
            error={errors.email?.message}
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
          <Input
            {...register("confirmPassword", {
              onChange: () => clearErrors(["confirmPassword", "root" as any]),
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
                  onChange: () => clearErrors(["acceptTerms", "root" as any]),
                })}
                className="w-4 h-4 accent-[#87BE00] focus:bg-green-500 hover:bg-green-500"
              />
              <label htmlFor="terms" className="text-primary font-medium">
                I agree{" "}
                <Link href="/terms">
                  <Text
                    as={"span"}
                    font={"bold"}
                    className="underline cursor-pointer hover:text-secondary-800 transition-colors"
                  >
                    Terms & Conditions
                  </Text>
                </Link>
              </label>
            </div>
            <Error error={errors?.acceptTerms?.message} />
          </div>

          <BackEndError
            error={
              errors.root?.message ? String(errors.root.message) : undefined
            }
          />
          <Button
            size={"lg"}
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full"
          >
            {signupMutation.isPending ? (
              <>
                <Spinner />
                <Text font={"medium"} className="text-white">
                  Creating Account...
                </Text>
              </>
            ) : (
              <Text font={"medium"} className="text-white">
                Sign Up
              </Text>
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
