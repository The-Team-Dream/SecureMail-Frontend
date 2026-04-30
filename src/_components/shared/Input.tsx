"use client";
import { cn } from "@/lib/utils";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Text } from "./Text";
/**
 * 📦 Input Component
 *
 * Reusable input field with support for:
 * - Optional label
 * - Left icon (ReactNode: icon or image)
 * - Error handling with animation
 * - Password visibility toggle
 *
 * 🔧 Props:
 * @param label - text displayed above the input
 * @param leftIcon - React node (icon/image) displayed inside the input (left side)
 * @param error - error message (changes input style + shows animated message)
 * @param type - input type (text, password, email, etc.)
 * @param ...props - all native input props
 *
 * ✨ Features:
 * - Automatically adjusts padding when leftIcon is used
 * - Shows/hides password when type="password"
 * - Animated error message using framer-motion
 *
 * 🧪 Example:
 * <Input
 *   label="Password"
 *   type="password"
 *   placeholder="Enter your password"
 *   leftIcon={<CircleAlert />}
 *   error="Password is too short"
 * />
 */
interface Input extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  error?: string | undefined;
}
export const errorVariants = {
  initial: { y: -10, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -10, opacity: 0 },
};
export const Input: React.FC<Input> = ({
  label,
  leftIcon,
  type = "text",
  required,
  error,
  className,
  ...props
}) => {
  const [inputType, setInputType] = useState(type);
  const isPassword = type === "password";
  const togglePassword = () => {
    setInputType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-primary-400 mb-1">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative w-full">
        {leftIcon && (
          <span
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${error ? "text-error-500" : "text-primary-400"}`}
          >
            {leftIcon}
          </span>
        )}
        <input
          {...props}
          required={required}
          type={inputType}
          className={cn(
            "w-full px-4 py-3 border text-primary rounded-xl outline-none focus:border-primary-400 transition duration-500",
            leftIcon && "pl-12",
            error
              ? "border-error-500 placeholder:text-error-500"
              : "border-primary-100 placeholder:text-primary-400",
            className,
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary cursor-pointer",
              inputType === "text" ? "text-primary" : "text-primary-400",
            )}
            aria-label={
              inputType === "password" ? "Show password" : "Hide password"
            }
          >
            {inputType === "password" ? <Eye /> : <EyeOff />}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            variants={errorVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ ease: "easeInOut", duration: 0.2, stiffness: 120 }}
            className="flex items-center gap-2 text-error mt-1"
          >
            <CircleAlert className="w-4 h-4 text-error-500" />
            <Text as={"span"} size={"sm"} color={"error"} font={"medium"}>
              {error}
            </Text>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
