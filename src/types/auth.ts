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
  resetPasswordToken: string;
}

export interface SignupResponse {
  data: {
    message: string;
  };
}

export interface VerifyOtpResponse {
  data: {
    message: string;
    user: {
      _id: string;
      email: string;
      username: string;
    };
  };
}

export interface SigninResponse {
  data: {
    message: string;
  };
}
