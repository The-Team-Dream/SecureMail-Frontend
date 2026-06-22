"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WizardFormData, wizardSchema } from "../schemas/CustomAccount";
import { Icons } from "@/constants/icons";
import { mailboxApi } from "@/APIs/features/mailboxes";
import {
  useConnectImap,
  useConnectGmail,
  useConnectOutlook,
} from "@/APIs/hooks/mailboxes";
import { toast } from "sonner";
import { MailboxProvider } from "@/APIs/types/Mailbox";
import logo from "../../public/icons/logo.png";

interface UseAddAccountWizardProps {
  onCancel: () => void;
  onSuccess?: (data: WizardFormData, provider: string) => void;
}

const STORAGE_KEYS = {
  DATA: "securemail_wizard_data",
};

export function useAddAccountWizard({
  onCancel,
  onSuccess,
}: UseAddAccountWizardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState<MailboxProvider>("IMAP");
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [isImapLoading, setIsImapLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isClearingRef = useRef(false);

  const { mutateAsync: connectImap } = useConnectImap();
  const { mutateAsync: connectGmail } = useConnectGmail();
  const { mutateAsync: connectOutlook } = useConnectOutlook();

  const form = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    shouldUnregister: false,
    defaultValues: {
      mailboxName: "",
      email: "",
      imapHost: "",
      imapPort: "",
      encryption: "SSL/TLS",
      smtpHost: "",
      smtpPort: "",
      password: "",
      syncInterval: "",
    },
  });

  const { register, trigger, watch, setValue, reset, clearErrors } = form;

  const formData = watch();

  const updateStepUrl = useCallback(
    (newStep: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", newStep.toString());
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  // Sync step from URL
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam) {
      const parsedStep = parseInt(stepParam);
      if (!isNaN(parsedStep) && parsedStep >= 1 && parsedStep <= 5) {
        setStep(parsedStep);
      } else {
        updateStepUrl(1);
      }
    } else {
      updateStepUrl(1);
    }
  }, [searchParams, updateStepUrl]);

  const clearPersistence = useCallback(() => {
    isClearingRef.current = true;
    sessionStorage.removeItem(STORAGE_KEYS.DATA);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("step");
    router.replace(pathname);
  }, [pathname, router, searchParams]);

  const handleCancel = useCallback(() => {
    clearPersistence();
    onCancel();
  }, [clearPersistence, onCancel]);

  // ─── OAuth Popup Listener ──────────────────────────────────────────────────
  useEffect(() => {
    const channel = new BroadcastChannel("securemail_oauth_channel");

    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type !== "OAUTH_CODE_RECEIVED" || !event.data?.code) {
        return;
      }

      const { code } = event.data;
      const origin = window.location.origin;
      const redirectUri =
        provider.toLowerCase() === "gmail"
          ? `${origin}/mailboxes/gmail/callback`
          : `${origin}/mailboxes/outlook/callback`;
      const oauthProvider = provider.toLowerCase();

      setIsOAuthLoading(true);
      try {
        if (oauthProvider === "gmail") {
          await connectGmail({ code, redirectUri });
        } else if (oauthProvider === "outlook") {
          await connectOutlook({ code, redirectUri });
        }

        // On Success
        clearPersistence();
        reset();
        handleCancel(); // Go back to mailboxes list directly
      } catch (error: any) {
        console.error(
          "OAuth Connection Failed Details:",
          error?.response?.data?.message,
        );
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to finalize account connection.",
        );
      } finally {
        setIsOAuthLoading(false);
      }
    };

    channel.addEventListener("message", handleMessage);
    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
  }, [
    provider,
    connectGmail,
    connectOutlook,
    clearPersistence,
    reset,
    handleCancel,
  ]);



  // Reset loading state when provider changes
  useEffect(() => {
    if (provider === "IMAP") {
      setIsOAuthLoading(false);
    }
  }, [provider]);

  // Form State Persistence (IMAP only)
  useEffect(() => {
    const storedData = sessionStorage.getItem(STORAGE_KEYS.DATA);
    if (storedData) {
      try {
        reset(JSON.parse(storedData));
      } catch (e) {
        console.error("Failed to load persisted form data", e);
      }
    }
    setIsLoaded(true);
  }, [reset]);

  useEffect(() => {
    if (!isLoaded) return;
    if (isClearingRef.current) {
      isClearingRef.current = false;
      return;
    }
    sessionStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(formData));
  }, [formData, isLoaded]);

  const handleChange = useCallback(
    (field: keyof WizardFormData, value: string) => {
      setValue(field, value, { shouldValidate: true, shouldDirty: true });
      clearErrors(field);
    },
    [clearErrors, setValue],
  );

  // ─── OAuth Popup Trigger ──────────────────────────────────────────────────
  const handleOAuthRedirect = useCallback(
    async (oauthProvider: "GMAIL" | "OUTLOOK") => {
      setIsOAuthLoading(true);

      // Open a blank window immediately to satisfy the browser's user-interaction requirement
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      const popup = window.open(
        "about:blank",
        "ConnectMailbox",
        `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`,
      );

      if (!popup) {
        setIsOAuthLoading(false);
        toast.error(
          "Popup blocker is enabled. Please allow popups for this site.",
        );
        return;
      }

      // Show a loading message with logo in the popup while waiting for the URL
      popup.document.write(`
        <html>
          <head>
            <title>Connecting...</title>
            <style>
              body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f9fafb; color: #111827; }
              .logo { width: 80px; height: 80px; margin-bottom: 24px; }
              .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3b82f6; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin-top: 16px; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              h1 { font-size: 24px; font-weight: 900; margin: 0; color: #0f172a; }
            </style>
          </head>
          <body>
            <img src="${logo.src}" class="logo" alt="SecureMail" />
            <h1>SecureMail</h1>
            <div class="spinner"></div>
            <div style="margin-top: 12px; color: #64748b;">Connecting to Provider...</div>
          </body>
        </html>
      `);

      try {
        const origin = window.location.origin;
        const redirectUri =
          oauthProvider === "GMAIL"
            ? `${origin}/mailboxes/gmail/callback`
            : `${origin}/mailboxes/outlook/callback`;
        let url: string;

        if (oauthProvider === "GMAIL") {
          const result = await mailboxApi.getGmailAuthUrl(redirectUri);
          url = result.url;
        } else {
          const result = await mailboxApi.getOutlookAuthUrl(redirectUri);
          url = result.url;
        }

        if (!url || !url.startsWith("http")) {
          throw new Error("Received an invalid redirect URL from the server.");
        }

        // Update the popup URL
        popup.location.href = url;
        setIsOAuthLoading(false);
      } catch (error: any) {
        if (popup) popup.close();
        const message =
          error?.response?.data?.message ||
          error?.message ||
          `Failed to connect ${oauthProvider}. Please try again.`;
        console.error(`OAuth error [${oauthProvider}]:`, error);
        toast.error(message);
        setIsOAuthLoading(false);
      }
    },
    [],
  );

  // ─── Step Validation ────────────────────────────────────────────────────────
  const validateStep = useCallback(async (): Promise<boolean> => {
    let fieldsToValidate: (keyof WizardFormData)[] = [];
    if (step === 1) fieldsToValidate = ["mailboxName"];
    if (step === 2)
      fieldsToValidate = [
        "email",
        "imapHost",
        "imapPort",
        "encryption",
        "smtpHost",
        "smtpPort",
        "password",
      ];
    if (step === 3) fieldsToValidate = ["syncInterval"];

    if (fieldsToValidate.length > 0) {
      return await trigger(fieldsToValidate);
    }
    return true;
  }, [step, trigger]);

  // ─── IMAP Submission (step 5 → save) ───────────────────────────────────────
  const handleImapSubmit = useCallback(async () => {
    setIsImapLoading(true);
    try {
      const security = formData.encryption?.toUpperCase();
      const isSecure = Boolean(security === "SSL/TLS");

      await connectImap({
        host: formData.imapHost,
        port: formData.imapPort as unknown as number,
        email: formData.email,
        password: formData.password,
        secure: isSecure,
        displayName: formData.mailboxName,
        smtpHost: formData.smtpHost || undefined,
        smtpPort: formData.smtpPort as unknown as number,
      });

      // ── Success: clear state and g  o back to list ──────────
      clearPersistence();
      reset();
      handleCancel();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to connect IMAP mailbox. Check your credentials and try again.";
      console.error("IMAP connection error:", error);
      toast.error(message);
    } finally {
      setIsImapLoading(false);
    }
  }, [connectImap, formData, clearPersistence, reset, handleCancel]);

  // ─── Next Handler ───────────────────────────────────────────────────────────
  const handleNext = useCallback(
    async (explicitProvider?: "GMAIL" | "OUTLOOK") => {
      const activeProvider = explicitProvider || provider;
      // OAuth providers skip all form steps — instant redirect
      if (
        step === 1 &&
        (activeProvider === "GMAIL" || activeProvider === "OUTLOOK")
      ) {
        await handleOAuthRedirect(activeProvider as "GMAIL" | "OUTLOOK");
        return;
      }

      const isValid = await validateStep();
      if (!isValid) return;

      // Final IMAP step
      if (step === 4 && provider === "IMAP") {
        await handleImapSubmit();
        return;
      }

      if (step < 5) {
        updateStepUrl(step + 1);
      }
    },
    [
      provider,
      step,
      handleOAuthRedirect,
      validateStep,
      handleImapSubmit,
      updateStepUrl,
    ],
  );

  const handlePrev = useCallback(() => {
    if (step > 1) updateStepUrl(step - 1);
  }, [step, updateStepUrl]);

  const goToStep = useCallback(
    async (targetStep: number) => {
      if (targetStep < 1 || targetStep > 5) return;

      if (targetStep < step) {
        updateStepUrl(targetStep);
      } else {
        // Validate all intermediate steps if moving forward
        let isValid = true;
        for (let i = step; i < targetStep; i++) {
          let fieldsToValidate: (keyof WizardFormData)[] = [];
          if (i === 1) fieldsToValidate = ["mailboxName"];
          if (i === 2)
            fieldsToValidate = [
              "email",
              "imapHost",
              "imapPort",
              "encryption",
              "smtpHost",
              "smtpPort",
              "password",
            ];
          if (i === 3) fieldsToValidate = ["syncInterval"];

          if (fieldsToValidate.length > 0) {
            const stepValid = await trigger(fieldsToValidate);
            if (!stepValid) {
              isValid = false;
              // Stop at the first invalid step
              if (i !== step) {
                updateStepUrl(i);
              }
              break;
            }
          }
        }

        if (isValid) {
          updateStepUrl(targetStep);
        }
      }
    },
    [step, trigger, updateStepUrl],
  );

  const handleSuccessCancel = useCallback(() => {
    onSuccess?.(formData, provider);
    clearPersistence();
    onCancel();
  }, [formData, provider, onSuccess, clearPersistence, onCancel]);

  const handleResetWizard = useCallback(() => {
    clearPersistence();
    updateStepUrl(1);
    reset();
    setProvider("IMAP");
  }, [clearPersistence, updateStepUrl, reset]);

  const steps = [
    { id: 1, icon: Icons.Mail, title: "Select Provider" },
    { id: 2, icon: Icons.Settings2, title: "IMAP/SMTP Config" },
    { id: 3, icon: Icons.Rocket, title: "Advanced Settings" },
    { id: 4, icon: Icons.Report, title: "Summary" },
  ];

  const currentStepTitle = steps.find((s) => s.id === step)?.title || "";

  const isOAuthProvider = provider === "GMAIL" || provider === "OUTLOOK";
  const isLastStep = step === 4;
  const nextButtonLabel = isOAuthLoading
    ? "Redirecting..."
    : isImapLoading
      ? "Connecting..."
      : isLastStep
        ? "Save"
        : isOAuthProvider && step === 1
          ? `Connect ${provider}`
          : "Next";

  const {
    formState: { errors },
  } = form;

  return {
    step,
    provider,
    setProvider,
    formData,
    register,
    errors,
    clearErrors,
    steps,
    handleNext,
    handlePrev,
    goToStep,
    handleCancel,
    handleChange,
    handleImapSubmit,
    handleSuccessCancel,
    handleResetWizard,
    isOAuthLoading,
    isImapLoading,
    isOAuthProvider,
    nextButtonLabel,
    currentStepTitle,
  };
}
