"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WizardFormData, wizardSchema } from "../schemas/CustomAccount";
import { Icons } from "@/constants/icons";

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
  const [provider, setProvider] = useState("Gmail");
  const [isLoaded, setIsLoaded] = useState(false);

  const STORAGE_KEYS = {
    DATA: "securemail_wizard_data",
  };

  const {
    register,
    trigger,
    watch,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    mode: "onBlur",
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

  const formData = watch();

  // Saving Step in URL
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

  // Form State Persistence
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEYS.DATA);
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
    localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(formData));
  }, [formData, isLoaded]);

  const clearPersistence = () => {
    localStorage.removeItem(STORAGE_KEYS.DATA);
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
  };

  const steps = [
    { id: 1, icon: Icons.Mail },
    { id: 2, icon: Icons.Settings2 },
    { id: 3, icon: Icons.Lock },
    { id: 4, icon: Icons.Rocket },
    { id: 5, icon: Icons.Report },
  ];

  const validateStep = async () => {
    let fieldsToValidate: (keyof WizardFormData)[] = [];
    if (step === 1) fieldsToValidate = ["mailboxName"];
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

  const handleNext = async () => {
    const isValid = await validateStep();
    if (!isValid) return;

    if (step === 1) {
      if (provider === "Gmail") {
        alert("Redirecting to Google OAuth...");
        return;
      }
      if (provider === "Outlook") {
        alert("Redirecting to Microsoft OAuth...");
        return;
      }
    }
    if (step === 5) {
      updateStepUrl(6);
    } else if (step < 6) {
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
  };

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
    handleSuccessCancel,
    handleResetWizard,
  };
}
