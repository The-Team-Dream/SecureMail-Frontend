import { useState, useEffect } from "react";
import LogoHeader from "../components/LogoHeader";
import FormHeader from "../components/FormHeader";
import HeroPanel from "../components/HeroPanel";

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setShowResend(true); 
    }
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput.focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("OTP entered:", otp.join(""));
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <LogoHeader title="SecureMail" />
          <FormHeader
            title="Verification code"
            subtitle="Enter OTP sent to mobile number 05xxxx345 and email address email@mail.com to login the portal"
          />

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="flex justify-center gap-3">
              {otp.map((num, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  value={num}
                  onChange={(e) => handleChange(e, i)}
                  maxLength={1}
                  className="w-12 h-12 border border-gray-300 text-center text-xl rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ))}
            </div>

            {showResend && (
              <div className="text-sm text-gray-500 mt-2">
                Resend OTP
              </div>
            )}
            {!showResend && (
              <div className="text-sm text-gray-500 mt-2">
                Resend in 00:{timer < 10 ? `0${timer}` : timer} sec
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-3 mt-4 rounded-lg font-medium"
            >
              Continue →
            </button>
          </form>
        </div>
      </div>

      <HeroPanel />
    </div>
  );
}
