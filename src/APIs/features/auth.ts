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
  formData: signinPayload,
): Promise<SigninResponse> => {
  const res = await axiosInstance.post<SigninResponse>("/signin", formData);
  return res.data;
};
