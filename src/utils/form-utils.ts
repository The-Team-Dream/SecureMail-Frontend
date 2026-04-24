// hooks/use-server-errors.ts
import { UseFormSetError, FieldValues, Path } from "react-hook-form";

export const useServerErrors = <T extends FieldValues>(
  setError: UseFormSetError<T>,
) => {
  const handleServerErrors = (err: any, formFields: (keyof T)[]) => {
    const backendErrors = err?.response?.data?.errors;
    const message = err?.response?.data?.message;

    if (backendErrors && Array.isArray(backendErrors)) {
      backendErrors.forEach((error: string) => {
        const lowerError = error.toLowerCase();
        const targetField = formFields.find((field) =>
          lowerError.includes(String(field).toLowerCase()),
        );

        if (targetField) {
          setError(targetField as Path<T>, { type: "server", message: error });
        }
      });
    }

    if (message) {
      setError("root" as Path<T>, { type: "server", message: message });
    }
  };

  return { handleServerErrors };
};
