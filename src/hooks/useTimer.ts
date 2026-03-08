"use client";
import { useEffect, useState } from "react";

export default function useTimer(initialState: number) {
  const [timeLeft, setTimeLeft] = useState(initialState);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  const resetTimer = () => setTimeLeft(initialState);
  return {
    timeLeft,
    formattedTime: `${minutes}:${seconds}`,
    resend: timeLeft === 0,
    resetTimer,
  };
}
