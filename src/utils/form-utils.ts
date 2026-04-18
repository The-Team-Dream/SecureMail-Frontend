import { AxiosError } from "axios";
import { UseFormSetError, FieldValues, Path } from "react-hook-form";

export const handleApiErrors = <T extends FieldValues>(
  error: AxiosError,
  setError: UseFormSetError<T>,
) => {
  const serverData = error.response?.data as {
    errors?: { path: string; message: string }[];
    message?: string;
  };

  if (serverData?.errors && Array.isArray(serverData.errors)) {
    serverData.errors.forEach((err: { path: string; message: string }) => {
      setError(err.path as Path<T>, {
        type: "server",
        message: err.message,
      });
    });
  }

  if (serverData?.message) {
    setError("root" as Path<T>, {
      message: serverData.message,
    });
  }
};
