import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface SigninPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}
export interface ResendOtpPayload {
  email: string;
}
export interface ForgotPasswordPayload {
  email: string;
}
export interface UpdatePasswordPayload {
  password: string;
  confirmPassword: string;
}

export const signup = async (formData: SignupPayload): Promise<any> => {
  const res = await axiosInstance.post<any>("/signup", formData);
  return res.data;
};

export const signin = async (payload: SigninPayload) => {
  const res = await axiosInstance.post<any>("/signin", payload);
  return res.data;
};
export const verifyOtp = async (payload: VerifyOtpPayload): Promise<any> => {
  const res = await axiosInstance.post<any>("/verifyOtp", payload);
  return res.data;
};

export const resendOtp = async (payload: ResendOtpPayload) => {
  const res = await axiosInstance.post<any>("/resendOtp", payload);
  return res.data;
};

export const forgotPassword = async (
  payload: ForgotPasswordPayload,
): Promise<any> => {
  const res = await axiosInstance.post<any>("/forgotPassword", payload);
  return res.data;
};

export const updatePassword = async (
  payload: UpdatePasswordPayload,
): Promise<any> => {
  const res = await axiosInstance.post<any>("/updatePassword", payload);
  return res.data;
};

export const logout = () => {
  Cookies.remove("token");
};
