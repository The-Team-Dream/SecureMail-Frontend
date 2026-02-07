import axiosInstance from "@/lib/axios";

export interface signupPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface signinPayload {
  email: string;
  password: string;
}
export interface verifyOtpPayload {
  email: string;
  otp: string;
}
export interface resendOtpPayload {
  email: string;
}

export interface SignupResponse {
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      fullName: string;
    };
  };
  message: string;
  errors?: Record<string, string>;
}

export interface SigninResponse {
  data: {
    token: string;
    user: {
      id: string;
      email: string;
    };
  };
  message: string;
  errors?: Record<string, string>;
}

export interface AuthError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const signup = async (
  formData: signupPayload,
): Promise<SignupResponse> => {
  const res = await axiosInstance.post<SignupResponse>("/signup", formData);
  return res.data;
};

export const signin = async (
  payload: signinPayload,
): Promise<SigninResponse> => {
  const res = await axiosInstance.post<SigninResponse>("/signin", payload);
  return res.data;
};

export const verifyOtp = async (payload: verifyOtpPayload) => {
  const res = await axiosInstance.post("/verifyOtp", payload);
  return res.data;
};

export const resendOtp = async (payload: resendOtpPayload) => {
  const res = await axiosInstance.post("/resendOtp", payload);
  return res.data;
};
