export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}
export interface ResendOtpData {
  email: string;
}
export interface ForgetPasswordData {
  email: string;
}
export interface ResetPasswordData {
  newPassword: string;
  confirmPassword: string;
  resetPasswordToken: string;
}

export type OAuthProvider = "google" | "outlook";

export interface SigninResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
    token: string;
  };
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
}

export interface ForgetPasswordResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
}

export interface AuthMe {
  user: {
    id: number;
    username: string;
    email: string;
    avatar: string | null;
    isVerified: boolean;
    totpEnabled: boolean;
    provider: string;
    role: string;
    createdAt: string;
  };
}
