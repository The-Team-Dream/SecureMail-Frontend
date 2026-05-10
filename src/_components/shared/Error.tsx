import { Text } from "@/_components/shared/Text";
import { CircleAlert } from "lucide-react";
import { errorVariants } from "@/_components/shared/Input";
import { AnimatePresence, motion } from "framer-motion";

const Error = ({ error }: { error: string | undefined }) => {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          key="error-message"
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
          <CircleAlert className="w-4 h-4 text-error-500" />
          <Text as={"span"} font={"medium"} size={"sm"} color={"error-500"}>
            {error}
          </Text>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Error;
