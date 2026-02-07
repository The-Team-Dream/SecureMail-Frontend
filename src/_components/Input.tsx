"use client";

import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";
import { useState } from "react";

interface Input extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
  error?: string | undefined;
}

export const Input: React.FC<Input> = ({
  label,
  leftIcon,
  isPassword = false,
  type = "text",
  error,
  ...props
}) => {
  const [inputType, setInputType] = useState(type);

  const togglePassword = () => {
    setInputType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-textMuted mb-1">{label}</label>
      )}
      <div className="relative w-full">
        {leftIcon && (
          <span
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${error ? "text-error" : "text-textMuted"}`}
          >
            {leftIcon}
          </span>
        )}
        <input
          {...props}
          type={inputType}
          className={cn(
            "w-full px-4 py-3 border text-primary rounded-xl outline-none focus:border-inputFocus",
            leftIcon && "pl-12",
            error
              ? "border-error placeholder:text-error"
              : "border-borderPrimary placeholder:text-textMuted",
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted hover:text-primary cursor-pointer"
            aria-label={
              inputType === "password" ? "Show password" : "Hide password"
            }
          >
            {inputType === "password" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-eye-icon lucide-eye"
              >
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-eye-off-icon lucide-eye-off"
              >
                <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                <path d="m2 2 20 20" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-2 text-error mt-1">
          <CircleAlert className="w-4 h-4" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};
