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
export interface ForgetPasswordPayload {
  email: string;
}
export interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
}
