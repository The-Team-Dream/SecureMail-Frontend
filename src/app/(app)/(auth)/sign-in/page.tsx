"use client";
import Cookies from "js-cookie";
import { useSignin } from "@/APIs/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LockIcon, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const signinMutation = useSignin({
    onSuccess: (res) => {
      const token = res?.data?.token;
      if (token) {
        Cookies.set("token", token);
      }
      toast.success("Signed in successfully");
      router.push("/");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "login failed");
    },
  });
  const isDisabled =
    signinMutation.isPending ||
    email.trim().length < 3 ||
    password.trim().length < 3;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signinMutation.mutate({ email, password });
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {" "}
          <div className="flex items-center gap-0.5 px-4 h-12 py-4 border border-border rounded-lg">
            <Mail className="text-textMuted" />
            <Input
              type="email"
              className="h-full w-full border-none text-primary"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center gap-0.5 px-4 h-12 py-4 border border-border rounded-lg">
            <LockIcon className="text-textMuted" />
            <Input
              type={showPassword ? "text" : "password"}
              className="flex-1 h-full border-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
          <Link
            href={"/forgot-password"}
            className="flex justify-end font-medium text-primary hover:underline float-right w-max"
          >
            Forgot Password?
          </Link>
          {signinMutation.isError && (
            <p className="text-destructive">
              {signinMutation.error?.response?.data?.message ||
                "An error occurred"}
            </p>
          )}
          <Button
            type="submit"
            disabled={isDisabled}
            size={"lg"}
            className={`w-full rounded-lg hover:bg-primaryHover transition-colors duration-300 ${isDisabled ? "bg-primary/50" : "bg-primary"}`}
          >
            {signinMutation.isPending ? "LOGGING IN..." : "LOGIN"}
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
          <div className="text-primary font-medium text-center">
            Don&apos;t have an account?{" "}
            <Link className="text-primary hover:underline" href={"/sign-up"}>
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
