"use client";
import Image from "next/image";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  useEffect(() => {
    if (timeLeft === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  const handleResend = () => {
    if (timeLeft === 0) setTimeLeft(30);
    setOtp("");
  };

  return (
    <div className="max-w-sm lg:max-w-lg w-full mx-auto">
      {/* Container */}
      <div className="flex flex-col text-center gap-6 2xl:gap-12">
        <Image
          src={"/icons/logo_Dark.png"}
          alt="Logo"
          width={200}
          height={200}
          className="cursor-pointer mx-auto"
        />
        <div className="space-y-8">
          <h3 className="text-2xl font-semibold text-primary">
            Verification code
          </h3>
          <p className="text-textSecondary">
            Enter OTP sent to mobile number{" "}
            <span className="font-medium">05xxx12345</span> and email address{" "}
            <span className="font-medium">email@email.com</span> to login the
            portal
          </p>
        </div>

        {/* OTP Input */}
        <div>
          <InputOTP maxLength={6} onChange={handleOtpChange} value={otp}>
            <InputOTPGroup className="flex items-center justify-between max-w-87.5 mx-auto w-full">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  data-testid="otp-slot"
                  className={`h-14 w-12 rounded-md text-3xl font-medium border transition-colors ${
                    otp[index] ? "border-inputFocus" : "border-borderPrimary"
                  }`}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Resend */}
        <p className="text-[15px] text-primary">
          <button
            onClick={handleResend}
            disabled={timeLeft > 0}
            className={`${
              timeLeft > 0
                ? "opacity-50 cursor-not-allowed"
                : "opacity-100 hover:underline cursor-pointer"
            }`}
          >
            {timeLeft > 0 ? `Resend in ${minutes}:${seconds}` : "Resend now"}
          </button>
        </p>

        <Button className="group flex items-center gap-2" size={"lg"}>
          <span>Continue</span>
          <MoveRight className="w-4 h-4 text-white group-hover:translate-x-2 transition duration-300" />
        </Button>
      </div>
    </div>
  );
}
