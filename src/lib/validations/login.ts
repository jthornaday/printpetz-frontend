import { IForgotPasswordRequest, IResetPasswordRequest } from "@/types/auth";
import { number, object, ObjectSchema, ref, string } from "yup";

const emailSchema = string().email("Invalid Email").required("Email is required");
const passwordSchema = string().min(6, "Password must be of at least 6 character").required();
const confirmPasswordSchema = string()
  .oneOf([ref("password"), undefined], "Passwords must match")
  .required("Confirm password is required");

export const loginSchema = object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
});

export const otpVerificationSchema = object({
  otp: string().min(6).max(6).required("OTP required"),
});

export const forgotPasswordSchema: ObjectSchema<IForgotPasswordRequest> = object({
  email: emailSchema,
  redirectTo: string().optional(),
});

export const resetPasswordSchema: ObjectSchema<IResetPasswordRequest> = object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
});
