import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface StepSuccessProps {
  onCancel: () => void;
  resetWizard: () => void;
}
const confettiVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.7 + i * 0.1,
      type: "spring",
      stiffness: 200,
    },
  }),
};

export function StepSuccess({ onCancel, resetWizard }: StepSuccessProps) {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] items-center justify-center p-8">
      <div className="flex flex-col items-center max-w-[540px] w-full animate-in fade-in zoom-in-95 duration-500">
        {/* Checkmark Icon */}
        <div className="relative mb-10 flex items-center justify-center">
          {/* Decorative confetti dots - Animated */}
          <motion.div
            custom={1}
            variants={confettiVariants}
            initial="initial"
            animate="animate"
            className="absolute -top-3 -left-8 w-2 h-2 rounded-full bg-blue-400"
          />
          <motion.div
            custom={2}
            variants={confettiVariants}
            initial="initial"
            animate="animate"
            className="absolute -top-1 -right-7 w-2.5 h-2.5 rounded-sm bg-yellow-400 rotate-12"
          />
          <motion.div
            custom={3}
            variants={confettiVariants}
            initial="initial"
            animate="animate"
            className="absolute bottom-3 -left-7 w-3 h-1 bg-red-400 -rotate-45 rounded"
          />
          <motion.div
            custom={4}
            variants={confettiVariants}
            initial="initial"
            animate="animate"
            className="absolute -bottom-3 right-1 w-2 h-2 rounded-full bg-blue-300"
          />
          <motion.div
            custom={5}
            variants={confettiVariants}
            initial="initial"
            animate="animate"
            className="absolute top-8 -right-9 w-2 h-2 rounded-full bg-[#87BE00]"
          />
          <motion.div
            custom={6}
            variants={confettiVariants}
            initial="initial"
            animate="animate"
            className="absolute -top-5 left-4 w-1.5 h-1.5 rounded-full bg-purple-400"
          />

          <div className="relative w-[100px] h-[100px]">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-[0_8px_16px_rgba(135,190,0,0.4)]"
            >
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                fill="#87BE00"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
              />
              {/* Circle Svg */}
              <motion.path
                d="M30 52L43 65L70 38"
                fill="transparent"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
            </svg>
          </div>
        </div>

        <div className="text-center">
          {/* Title */}
          <Text
            as="h2"
            size="3xl"
            font="normal"
            color={"primary-900"}
            className="mb-3"
          >
            Account added successfully
          </Text>

          {/* Subtitle */}
          <Text
            size="sm"
            color={"primary-500"}
            className="mb-10 max-w-[420px] leading-relaxed"
          >
            your account added successfully to SecureMail.
            <br />
            Start getting mails securely.
          </Text>
        </div>

        {/* Add New Account Button */}
        <Button size={"lg"} className="mb-6 px-8" onClick={resetWizard}>
          Add New Account
        </Button>

        {/* View My Accounts Link */}
        <button
          onClick={onCancel}
          className="text-sm font-medium text-primary hover:text-primary-800 transition-colors inline-flex items-center gap-1 underline underline-offset-2 group cursor-pointer"
        >
          View My accounts
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    </div>
  );
}
