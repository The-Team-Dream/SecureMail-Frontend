"use client";
import Cookies from "js-cookie";
import { useSignin } from "@/APIs/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LockIcon, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/_components/Input";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signinMutation.mutate({ email, password });
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
          <p className="text-sm xl:text-base text-textSecondary">
            Enter your email address and password to log in.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {" "}
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email Address"
            leftIcon={<Mail />}
          />
          <Input
            type="password"
            isPassword
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<LockIcon />}
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
            className={`w-full rounded-lg hover:bg-primaryHover transition-colors duration-300 ${signinMutation.isPending ? "bg-primary/60" : "bg-primary"}`}
          >
            {signinMutation.isPending ? "LOGGING IN..." : "LOGIN"}
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
              className="w-[45%] bg-transparent border border-borderSecondary rounded-xl"
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
              className="w-[45%] bg-transparent border border-borderSecondary rounded-xl"
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
            <Link className="text-primary font-medium hover:underline" href={"/sign-up"}>
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
