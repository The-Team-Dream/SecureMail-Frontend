"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import useTimer from "@/hooks/useTimer";
import Logo from "@/_components/shared/Logo";
import { useResendOtp, useVerifyOtp } from "@/APIs/hooks/auth";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { Text } from "@/_components/shared/Text";
import { Spinner } from "@/components/ui/spinner";
import dynamic from "next/dynamic";

const SuccessOverlay = dynamic(() => import("@/_components/shared/SuccessOverlay"));

function VerifyOtpContent() {
  const [otp, setOtp] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { timeLeft, resend, resetTimer, formattedTime } = useTimer(30);
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { mutate, isPending } = useVerifyOtp({
    onSuccess: () => {
      setIsSuccess(true);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data.message || "Error");
    },
  });

  const { mutate: resendOtp, isPending: resendPending } = useResendOtp({
    onSuccess: (res) => {
      toast.success(res.data.message);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data.message || "Error");
    },
  });
  const handleOtpChange = (value: string) => {
    const otpNumbers = value.replace(/[^0-9]/g, "");
    setOtp(otpNumbers);
  };

  const handleVerify = (otpValue?: string) => {
    const finalOtp = otpValue || otp;
    if (finalOtp.length === 6) {
      mutate({ email, otp: finalOtp });
    } else {
      toast.error("Otp must be 6 digits");
    }
  };

  const handleResend = () => {
    if (resend) {
      resendOtp({ email });
      toast.success("OTP sent successfully");
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
            <Text as={"h1"} font={"semiBold"} size={"32"}>
              Verification code
            </Text>

            <Text color={"primary-500"} font={"medium"}>
              Enter OTP sent to your email address{" "}
              <span className="font-semibold">{email}</span> to login to the
              portal
            </Text>
          </div>

          {/* OTP Input */}
          <div>
            <InputOTP
              maxLength={6}
              onChange={handleOtpChange}
              onComplete={handleVerify}
              value={otp}
              inputMode="numeric"
              disabled={isPending}
            >
              <InputOTPGroup className="flex items-center justify-between max-w-95 mx-auto w-full">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    data-testid="otp-slot"
                    className={`h-14 w-12 rounded-md text-3xl text-[#333] font-medium border transition-colors border-primary-400`}
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
                  : " text-primary hover:underline cursor-pointer"
              }`}
            >
              {timeLeft > 0 ? `Resend in ${formattedTime}` : "Resend now"}
            </button>
          </p>

          <Button
            onClick={() => handleVerify()}
            disabled={isPending}
            className="group w-full"
            size={"lg"}
          >
            {isPending ? <Spinner /> : "Verify"}

            {!isPending && (
              <MoveRight className="w-4 h-4 text-background group-hover:translate-x-2 transition duration-300" />
            )}
          </Button>
        </div>
      </div>
      <SuccessOverlay isSuccess={isSuccess} />
    </div>
  );
}

export default function VerifyOtp() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading…
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
