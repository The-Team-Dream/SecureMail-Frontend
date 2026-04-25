import React from "react";
import { Text } from "./Text";
import { CircleAlert } from "lucide-react";
import { errorVariants } from "./Input";
import { AnimatePresence, motion } from "framer-motion";

const Error = ({ error }: { error: string | undefined }) => {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          variants={errorVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            ease: "easeInOut",
            duration: 0.2,
            stiffness: 120,
          }}
          className="flex items-center gap-2 text-error mt-1"
        >
          <CircleAlert className="w-4 h-4" />
          <Text as={"span"} font={"medium"} size={"sm"} color={"error"}>
            {error}
          </Text>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Error;
