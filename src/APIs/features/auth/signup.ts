import axiosInstance from "@/lib/axios";
import { SignupData, SignupResponse } from "../../types/auth";

export const signup = async (formData: SignupData): Promise<SignupResponse> => {
  const res = await axiosInstance.post<SignupResponse>(
    "/auth/register",
    formData,
  );
  return res.data;
};
