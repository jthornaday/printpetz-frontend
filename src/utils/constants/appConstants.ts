import { ROUTES } from "@/routes";

export const publicRoutes = [
  ROUTES.login,
  ROUTES.signup,
  ROUTES.verification,
  ROUTES.forgotPassword,
  ROUTES.landing,
];

export const protectedRoutes = [ROUTES.create, ROUTES.history, ROUTES.plan];

export const appConstants = {
  modelTraining: {
    imageSelectionLimit: { min: 15, max: 30 },
  },
  storage: {
    bucket: "decat",
  },
};

export const supabaseErrors: Record<string, string> = {
  email_not_verified: "Please verify your email before logging in.",
  invalid_credentials: "Invalid email or password. Please check your credentials.",
  email_rate_limit_exceeded:
    "You’ve requested too many emails. Please wait a moment before trying again.",
  user_already_exists: "This email is already registered. Try logging in instead.",
  weak_password: "Your password is too weak. Please choose a stronger one.",
  invalid_email: "Please enter a valid email address.",
  otp_expired: "Your verification code has expired. Please request a new one.",
  otp_invalid: "The code you entered is incorrect. Please try again.",
  user_not_found: "No account found with this email. Please sign up first.",
  provider_email_not_verified: "Please verify your email with your provider before logging in.",
  unexpected_failure: "Something went wrong. Please try again later.",
  server_error: "Something went wrong on our end. Please try again later.",
};
