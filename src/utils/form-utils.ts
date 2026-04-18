import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { AxiosError } from "axios";

interface ApiErrorDetail {
  path: string;
  message: string;
}

interface ApiErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  errors?: ApiErrorDetail[];
  path: string;
  timestamp: string;
}

export const handleApiErrors = <T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
) => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const errorData = axiosError.response?.data;
  if (errorData?.errors && Array.isArray(errorData.errors)) {
    errorData.errors.forEach((err) => {
      setError(err.path as Path<T>, {
        type: "server",
        message: err.message,
      });
    });
  } else if (errorData?.message) {
    setError("root" as Path<T>, {
      type: "server",
      message: errorData.message,
    });
  }
};
