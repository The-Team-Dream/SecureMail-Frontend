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
import z from "zod";
import { Input } from "@/_components/Input";
const signupSchema = z
  .object({
    fullName: z.string().min(1, { message: "Full name is required" }),
    email: z.string().min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    terms: z.literal(true, {
      message: "You must agree to Terms & Conditions",
    }),
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
    setError,
    formState: { errors },
  } = useForm<ISignUp>({
    mode: "onBlur",
    resolver: zodResolver(signupSchema),
  });
  const router = useRouter();

  type ISignUp = z.infer<typeof signupSchema>;

  const signupMutation = useSignup({
    onSuccess: (res) => {
      const token = res?.data?.token;
      if (token) Cookies.set("token", token);

      toast.success("Signed up successfully");
      router.push("/");
    },
    // onError: (err) => {
    //   const errors = err?.response?.data?.errors;

    //   if (errors) {
    //     Object.entries(errors).forEach(([key, value]) => {
    //       setError(key as keyof ISignUp, {
    //         type: "server",
    //         message: value as string,
    //       });
    //     });
    //   } else {
    //     toast.error(err?.response?.data?.message || "Signup failed");
    //   }
    // },
  });

  const onSubmit: SubmitHandler<ISignUp> = ({ fullName, email, password }) => {
    const form = { fullName, email, password };
    signupMutation.mutate(form);
    reset();
  };

  return (
    <div className="max-w-sm lg:max-w-lg w-full mx-auto">
      {/* Form Container */}
      <div className="flex flex-col text-center lg:text-left gap-6">
        <Image
          src={"/icons/logo_Dark.png"}
          alt="Logo"
          width={200}
          height={200}
          className="cursor-pointer mx-auto lg:mx-0"
        />
        <div className="space-y-2">
          <h3 className="text-3xl text-primary">Hello, Welcome back</h3>
          <p className="text-textSecondary text-sm xl:text-base">
            Enter your email address and password to log in.
          </p>
        </div>
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
            <div className="flex items-center gap-4 ">
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
            {errors.terms && (
              <div className="flex items-center gap-2 text-error mt-1">
                <CircleAlert className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {errors.terms.message}
                </span>
              </div>
            )}
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
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-borderSecondary" />
            <span className="text-center text-borderSecondary">Or</span>
            <div className="flex-1 h-px bg-borderSecondary" />
          </div>
          <div className="flex items-center justify-between">
            <Button
              size={"lg"}
              variant={"outline"}
              className="w-[45%] border-borderSecondary rounded-xl"
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
              className="w-[45%] border-borderSecondary rounded-xl"
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
        </div>
      </div>
    </div>
  );
}
