// hooks/use-server-errors.ts
import { UseFormSetError, FieldValues, Path } from "react-hook-form";

export const useServerErrors = <T extends FieldValues>(
  setError: UseFormSetError<T>,
) => {
  const handleServerErrors = (err: any, formFields: (keyof T)[]) => {
    const responseData = err?.response?.data;
    const errors = responseData?.errors || responseData?.message;

    let errorHandled = false;

    if (errors) {
      const errorList = Array.isArray(errors) ? errors : [errors];

      const sortedFields = [...formFields].sort(
        (a, b) => String(b).length - String(a).length,
      );

      errorList.forEach((error: string) => {
        const lowerError = String(error).toLowerCase();
        const targetField = sortedFields.find((field) =>
          lowerError.includes(String(field).toLowerCase()),
        );

        if (targetField) {
          setError(targetField as Path<T>, { type: "server", message: error });
          errorHandled = true;
        }
      });

      if (!errorHandled && typeof errors === "string") {
        setError("root" as Path<T>, { type: "server", message: errors });
      } else if (!errorHandled && Array.isArray(errors) && errors.length > 0) {
        setError("root" as Path<T>, {
          type: "server",
          message: errors[0],
        });
      }
    }
  };

  return { handleServerErrors };
};
