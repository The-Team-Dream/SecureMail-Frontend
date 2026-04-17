"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { Text } from "./shared/Text";
import Logo from "./shared/Logo";

interface SplashPreloaderProps {
  children: React.ReactNode;
}

function Particle({
  delay,
  x,
  size,
}: {
  delay: number;
  x: number;
  size: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: 0,
        background: "var(--secondary-500)",
        filter: `blur(${size / 3}px)`,
      }}
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: -600, opacity: [0, 0.8, 0] }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}
function ShieldIcon() {
  return (
    <motion.svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 1.2, duration: 0.6, ease: "backOut" }}
    >
      <motion.path
        d="M12 2L3 7v5c0 5.25 3.75 10.14 9 11.25C17.25 22.14 21 17.25 21 12V7l-9-5z"
        stroke="var(--secondary-500)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.4, duration: 1, ease: "easeInOut" }}
      />
      <motion.path
        d="M9 12l2 2 4-4"
        stroke="var(--secondary-500)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 2, duration: 0.5, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

export default function SplashPreloader({ children }: SplashPreloaderProps) {
  const [loading, setLoading] = useState(true);

  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        delay: Math.random() * 2,
        x: Math.random() * 100,
        size: Math.random() * 4 + 2,
      })),
    [],
  );

  useEffect(() => {
    const hasSplash = localStorage.getItem("hasSplash");
    const displayTime = hasSplash ? 1500 : 3200;

    const timer = setTimeout(() => {
      setLoading(false);
      if (!hasSplash) localStorage.setItem("hasSplash", "true");
    }, displayTime);

    return () => clearTimeout(timer);
  }, []);

  const tagline = "Preparing for a secure journey…";

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="splash"
          className="fixed inset-0 z-9999 flex items-center justify-center overflow-hidden bg-background"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            className="pointer-events-none absolute"
            style={{
              width: 420,
              height: 420,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, var(--secondary-500) 0%, transparent 70%)",
              opacity: 0,
              filter: "blur(80px)",
            }}
            animate={{ opacity: [0, 0.15, 0.1] }}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          {/* ── Floating Particles ── */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {particles.map((p) => (
              <Particle key={p.id} delay={p.delay} x={p.x} size={p.size} />
            ))}
          </div>

          {/* ── Center Content ── */}
          <div className="relative flex flex-col items-center gap-5">
            {/* Logo + Name */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ y: 30, opacity: 0, filter: "blur(12px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                animate={{ rotate: [0, -6, 6, 0] }}
                transition={{
                  delay: 0.8,
                  duration: 1.2,
                  ease: "easeInOut",
                }}
              >
                <Logo />
              </motion.div>
            </motion.div>

            {/* Shield badge */}
            <motion.div
              className="flex items-center gap-2 rounded-full border px-4 py-1.5"
              style={{
                borderColor: "var(--secondary-500)",
                background:
                  "color-mix(in srgb, var(--secondary-500) 8%, transparent)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <ShieldIcon />
              <Text
                as={"span"}
                font={"medium"}
                size={"sm"}
                color={"secondary-600"}
              >
                End-to-End Encrypted
              </Text>
            </motion.div>

            <motion.p
              className="mt-2 text-sm tracking-wide text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.4 }}
            >
              {tagline.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1.6 + i * 0.03,
                    duration: 0.25,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.p>

            <motion.div
              className="mt-1 h-[2px] overflow-hidden rounded-full"
              style={{
                width: 180,
                background: "var(--border)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.4 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: "var(--secondary-500)" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  delay: 2.2,
                  duration: 1.8,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
