import { AuthError } from "@supabase/supabase-js";

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISignupRequest extends ILoginRequest {
  confirmPassword: string;
}

export interface IVerificationRequest {
  otp: string;
}

export interface IResendOtpRequest {
  email: string;
}

export interface IForgotPasswordRequest {
  email: string;
  redirectTo?: string;
}

export interface IResetPasswordRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SupabaseCustomAuthError {
  code: AuthError["code"];
  status: AuthError["status"];
  message: AuthError["message"];
}
