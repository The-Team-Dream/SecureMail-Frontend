"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "primary";
}

export const ConfirmationModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "primary",
}: ConfirmationModalProps) => {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background/40 backdrop-blur-sm"
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild>
              <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] p-4 focus:outline-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                  className="relative overflow-hidden rounded-2xl bg-background p-6 shadow-2xl"
                >
                  <div className="flex flex-col gap-2">
                    <DialogPrimitive.Title className="text-xl font-bold text-primary-950">
                      {title}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="text-sm text-primary-500">
                      {description}
                    </DialogPrimitive.Description>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <DialogPrimitive.Close asChild>
                      <Button
                        variant="ghost"
                        disabled={isLoading}
                        className="rounded-xl px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-100"
                      >
                        {cancelText}
                      </Button>
                    </DialogPrimitive.Close>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        onConfirm();
                      }}
                      disabled={isLoading}
                      className={cn(
                        "rounded-xl px-6 py-2 text-sm font-semibold transition-all active:scale-95",
                        variant === "danger"
                          ? "bg-error-600 text-primary-50 hover:bg-error-700 shadow-lg shadow-error-200"
                          : "bg-primary-600 text-primary-50 hover:bg-primary-700 shadow-lg shadow-primary-200",
                      )}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Processing...
                        </div>
                      ) : (
                        confirmText
                      )}
                    </Button>
                  </div>

                  <DialogPrimitive.Close asChild>
                    <button
                      className="absolute right-4 top-4 rounded-full p-1 text-primary-500 transition-colors hover:bg-primary-100 hover:text-primary-900 cursor-pointer"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </DialogPrimitive.Close>
                </motion.div>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};
