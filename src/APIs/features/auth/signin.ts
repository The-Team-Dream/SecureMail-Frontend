import axiosInstance from "@/lib/axios";
import { SigninData, SigninResponse } from "../../types/auth";

export const signin = async (formData: SigninData): Promise<SigninResponse> => {
  const res = await axiosInstance.post<SigninResponse>("/auth/login", formData);
  return res.data;
};
