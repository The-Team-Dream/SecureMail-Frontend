"use client";

import { useState, useEffect } from "react";
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

interface UseAddAccountWizardProps {
  onCancel: () => void;
  onSuccess?: (data: WizardFormData, provider: string) => void;
}

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

  const { mutateAsync: connectImap } = useConnectImap();
  const { mutateAsync: connectGmail } = useConnectGmail();
  const { mutateAsync: connectOutlook } = useConnectOutlook();

  const STORAGE_KEYS = {
    DATA: "securemail_wizard_data",
  };

  const form = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    shouldUnregister: false,
    defaultValues: {
      mailboxName: "",
      emailAddress: "",
      imapHost: "",
      imapPort: "",
      imapSecurity: "SSL/TLS",
      imapUsername: "",
      imapPassword: "",
      smtpHost: "",
      smtpPort: "",
      smtpSecurity: "SSL/TLS",
      smtpUsername: "",
      smtpPassword: "",
      syncInterval: "",
    },
  });

  const {
    register,
    trigger,
    watch,
    setValue,
    reset,
    clearErrors,
  } = form;

  const formData = watch();

  // Sync step from URL
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam) {
      const parsedStep = parseInt(stepParam);
      if (!isNaN(parsedStep) && parsedStep >= 1 && parsedStep <= 6) {
        setStep(parsedStep);
      } else {
        updateStepUrl(1);
      }
    } else {
      updateStepUrl(1);
    }
  }, [searchParams]);

  const updateStepUrl = (newStep: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", newStep.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  // ─── OAuth Popup Listener ──────────────────────────────────────────────────
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.data?.type !== "OAUTH_CODE_RECEIVED" ||
        !event.data?.code
      ) {
        return;
      }

      const { code } = event.data;
      const origin = window.location.origin.includes("localhost")
        ? "http://localhost:3001"
        : window.location.origin;
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

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [provider, connectGmail, connectOutlook, router]);

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
    sessionStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(formData));
  }, [formData, isLoaded]);

  const clearPersistence = () => {
    sessionStorage.removeItem(STORAGE_KEYS.DATA);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("step");
    router.replace(pathname);
  };

  const handleCancel = () => {
    clearPersistence();
    onCancel();
  };

  const handleChange = (field: keyof WizardFormData, value: string) => {
    setValue(field, value, { shouldValidate: true, shouldDirty: true });
    clearErrors(field);
  };

  // ─── OAuth Popup Trigger ──────────────────────────────────────────────────
  const handleOAuthRedirect = async (oauthProvider: "GMAIL" | "OUTLOOK") => {
    setIsOAuthLoading(true);
    try {
      const origin = window.location.origin.includes("localhost")
        ? "http://localhost:3001"
        : window.location.origin;
      const redirectUri = `${origin}/mailboxes/gmail/callback`;
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

      // Open centered popup
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      window.open(
        url,
        "ConnectMailbox",
        `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`,
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        `Failed to connect ${oauthProvider}. Please try again.`;
      console.error(`OAuth error [${oauthProvider}]:`, error);
      toast.error(message);
      setIsOAuthLoading(false);
    }
  };

  // ─── Step Validation ────────────────────────────────────────────────────────
  const validateStep = async (): Promise<boolean> => {
    let fieldsToValidate: (keyof WizardFormData)[] = [];
    if (step === 1) fieldsToValidate = ["mailboxName", "emailAddress"];
    if (step === 2)
      fieldsToValidate = [
        "imapHost",
        "imapPort",
        "imapSecurity",
        "imapUsername",
        "imapPassword",
      ];
    if (step === 3)
      fieldsToValidate = [
        "smtpHost",
        "smtpPort",
        "smtpSecurity",
        "smtpUsername",
        "smtpPassword",
      ];
    if (step === 4) fieldsToValidate = ["syncInterval"];

    if (fieldsToValidate.length > 0) {
      return await trigger(fieldsToValidate);
    }
    return true;
  };

  // ─── IMAP Submission (step 5 → save) ───────────────────────────────────────
  const handleImapSubmit = async () => {
    setIsImapLoading(true);
    try {
      const security = formData.imapSecurity?.toUpperCase();
      const isSecure = Boolean(security === "SSL/TLS");

      await connectImap({
        host: formData.imapHost,
        port: formData.imapPort as unknown as number,
        email: formData.emailAddress,
        password: formData.imapPassword,
        secure: isSecure,
        displayName: formData.mailboxName,
        smtpHost: formData.smtpHost || undefined,
        smtpPort: formData.smtpPort as unknown as number,
      });

      // ── Success: clear state and go back to list ──────────
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
  };

  // ─── Next Handler ───────────────────────────────────────────────────────────
  const handleNext = async (explicitProvider?: "GMAIL" | "OUTLOOK") => {
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
    if (step === 5 && provider === "IMAP") {
      await handleImapSubmit();
      return;
    }

    if (step < 6) {
      updateStepUrl(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) updateStepUrl(step - 1);
  };

  const handleSuccessCancel = () => {
    onSuccess?.(formData, provider);
    clearPersistence();
    onCancel();
  };

  const handleResetWizard = () => {
    clearPersistence();
    updateStepUrl(1);
    reset();
    setProvider("IMAP");
  };

  const steps = [
    { id: 1, icon: Icons.Mail },
    { id: 2, icon: Icons.Settings2 },
    { id: 3, icon: Icons.Lock },
    { id: 4, icon: Icons.Rocket },
    { id: 5, icon: Icons.Report },
  ];

  const isOAuthProvider = provider === "GMAIL" || provider === "OUTLOOK";
  const isLastStep = step === 5;
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
    handleCancel,
    handleChange,
    handleImapSubmit,
    handleSuccessCancel,
    handleResetWizard,
    isOAuthLoading,
    isImapLoading,
    isOAuthProvider,
    nextButtonLabel,
  };
}
