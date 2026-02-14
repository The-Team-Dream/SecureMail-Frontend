"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import useCountDown from "@/hooks/useCountDown";
import Logo from "@/_components/Logo";
import { useResendOtp, useVerifyOtp } from "@/APIs/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const { timeLeft, resend, resetTimer, formattedTime } = useCountDown(30);
  const router = useRouter();
  const { mutate, isPending } = useVerifyOtp({
    onSuccess: () => {
      router.push("/");
      toast.success("Your email has been verified");
    },
    onError: () => {
      toast.error("Invalid Otp");
    },
  });

  const { mutate: resendOtp, isPending: resendPending } = useResendOtp({
    onSuccess: () => {
      toast.success("Otp sent successfully");
    },
    onError: () => {
      toast.error("Failed to send otp");
    },
  });
  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      // mutate({ email, otp });
    } else {
      alert("Otp must be 6 digits");
    }
  };

  const handleResend = () => {
    if (resend) {
      // resendOtp({ email });
      setOtp("");
      resetTimer();
    }
  };

  return (
    <div className="relative w-full">
      <div className="absolute top-12 left-1/2 -translate-x-1/2">
        <Logo />
      </div>
      {/* Container */}
      <div className="max-w-sm lg:max-w-lg w-full mx-auto flex items-center justify-center min-h-screen -my-4!">
        <div className="flex flex-col text-center gap-8">
          <div className="space-y-8">
            <h1 className="text-2xl font-semibold text-primary">
              Verification code
            </h1>
            <p className="text-textSecondary text-sm">
              Enter OTP sent to mobile number{" "}
              <span className="font-medium">05xxx12345</span> and email address{" "}
              <span className="font-medium">email@email.com</span> to login the
              portal
            </p>
          </div>

          {/* OTP Input */}
          <div>
            <InputOTP maxLength={6} onChange={handleOtpChange} value={otp}>
              <InputOTPGroup className="flex items-center justify-between max-w-95 mx-auto w-full">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    data-testid="otp-slot"
                    className={`h-14 w-12 rounded-md text-3xl text-[#333] font-medium border transition-colors ${
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
              disabled={!resend || resendPending}
              className={`${
                !resend
                  ? "opacity-50 cursor-not-allowed"
                  : " opacity-100 hover:underline cursor-pointer"
              }`}
            >
              {timeLeft > 0 ? `Resend in ${formattedTime}` : "Resend now"}
            </button>
          </p>

          <Button
            onClick={handleVerify}
            disabled={isPending}
            className="group flex items-center gap-2"
            size={"lg"}
          >
            <span>{isPending ? "Sending..." : "Continue"}</span>

            {!isPending && (
              <MoveRight className="w-4 h-4 text-white group-hover:translate-x-2 transition duration-300" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
