"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Icons } from "@/constants/icons";
import { useUpdateTheme } from "@/APIs/hooks/userSettings";
import { useGetUserSettings } from "@/APIs/hooks/userSettings";

type ThemeTogglerProps = {
  isCollapsed?: boolean;
};

const ThemeToggler = ({ isCollapsed = false }: ThemeTogglerProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { mutate: updateTheme } = useUpdateTheme();
  const { data: settings } = useGetUserSettings();

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted
    ? (resolvedTheme ??
      (theme === "dark" || theme === "light" ? theme : "light"))
    : "light";

  const setActiveTheme = (t: "light" | "dark") => {
    setTheme(t);
    updateTheme(t === "light" ? "LIGHT" : "DARK");
  };

  if (!mounted) {
    return (
      <div aria-hidden>
        <hr className="mb-4 -m-2 h-px bg-primary-100" />
        <div
          className={cn(
            "mx-auto rounded-xl bg-muted",
            isCollapsed ? "h-24 w-12" : "h-12 w-full",
          )}
        />
        <hr className="mt-4 -m-2 h-px bg-primary-100" />
      </div>
    );
  }

  return (
    <div>
      <div
        className={cn(
          "relative mx-auto flex rounded-xl bg-primary-100 p-1 transition-all duration-300",
          isCollapsed
            ? "h-24 w-12 flex-col gap-2"
            : "h-12 w-full flex-row gap-0",
        )}
      >
        <motion.div
          className="absolute rounded-lg shadow-sm"
          initial={false}
          animate={{
            top: isCollapsed
              ? activeTheme === "light"
                ? "4px"
                : "calc(50% + 2px)"
              : "4px",
            left: isCollapsed
              ? "4px"
              : activeTheme === "light"
                ? "4px"
                : "calc(50% + 2px)",
            width: isCollapsed ? "calc(100% - 8px)" : "calc(50% - 6px)",
            height: isCollapsed ? "calc(50% - 6px)" : "calc(100% - 8px)",
            backgroundColor: activeTheme === "light" ? "#ffffff" : "#000000",
          }}
          transition={{
            type: "spring",
            stiffness: 600,
            damping: 30,
          }}
        />

        <button
          type="button"
          aria-pressed={activeTheme === "light"}
          onClick={() => setActiveTheme("light")}
          className={cn(
            "relative z-10 flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm transition-colors duration-300",
            activeTheme === "light"
              ? "font-medium text-primary"
              : "text-muted-foreground",
          )}
        >
          <Icons.Light size={18} />
          {!isCollapsed && "Light"}
        </button>

        <button
          type="button"
          aria-pressed={activeTheme === "dark"}
          onClick={() => setActiveTheme("dark")}
          className={cn(
            "relative z-10 flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm transition-colors duration-300",
            activeTheme === "dark"
              ? "font-medium text-white"
              : "text-muted-foreground",
          )}
        >
          <Icons.Dark size={18} />
          {!isCollapsed && "Dark"}
        </button>
      </div>
      <hr className="mt-4 -m-2 h-px bg-primary-100" />
    </div>
  );
};

export default ThemeToggler;
