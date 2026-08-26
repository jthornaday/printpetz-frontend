import React, { useState } from "react";
import Logo from "../utils/images/logo.png";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { ControlledInput } from "@/components/ui/form/ControlledInput";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/lib/validations/login";
import { ILoginRequest } from "@/types/auth";
import { PasswordEyeButton } from "@/components/ui/passwordEyeButton";
import { ROUTES } from "@/routes";
import { useRouter } from "next/router";
import { Footer } from "@/components/shared/Footer";
import {
  useResendEmailOtpMutation,
  useSignInWithEmailMutation,
  useSignInWithProviderMutation,
} from "@/store/api/authApi";
import { useToast } from "@/hooks/useToast";
import { EToastType } from "@/types/toast";

const LoginPage = () => {
  const router = useRouter();

  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [handleGoogleAuth, { isLoading: isProviderSigning }] = useSignInWithProviderMutation();
  const [handleSignIn, { isLoading: isSignInButtonLoading }] = useSignInWithEmailMutation();
  const [resendEmailOtp, { isLoading: isResendEmailOtpLoading }] = useResendEmailOtpMutation();

  const methods = useForm<ILoginRequest>({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(loginSchema),
  });
  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { error: signinError } = await handleSignIn(formData);

    if (signinError) {
      if (signinError.code === "email_not_confirmed") {
        const { error: resendError } = await resendEmailOtp({ email: formData.email });
        if (resendError) {
          if (resendError?.code !== "over_email_send_rate_limit") {
            toast(EToastType.ERROR, resendError?.message ?? "Something went wrong");
            return;
          }
        }

        router.push({ pathname: ROUTES.verification, query: { email: formData.email } });
        return;
      }

      toast(EToastType.ERROR, signinError.message ?? "Something went wrong");
      return false;
    }
  });

  const isBtnDisabled = isSignInButtonLoading || isResendEmailOtpLoading || isProviderSigning;
  const isSigningIn = isSignInButtonLoading || isResendEmailOtpLoading;

  return (
    <div className="relative w-full lg:w-1/2 flex items-center justify-center px-6 md:px-12 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-14 mb-20">
        {/* Logo */}
        <div
          className="relative w-44 h-[68px] text-center cursor-pointer"
          onClick={() => router.push(ROUTES.landing)}
        >
          <CustomImagePreview image={Logo} />
        </div>

        {/* Welcome Text */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-1.5">Welcome to PrintPetz</h2>
          <p className="text-black-40">Please enter your Email & Password to sign in</p>
        </div>

        <div className="flex flex-col w-full gap-5">
          {/* Form */}
          <FormProvider {...methods}>
            <div className="flex flex-col gap-4">
              {/* Email Input */}
              <ControlledInput name="email" label="Email" placeholder="name@sample.com" />

              {/* Password Input */}
              <ControlledInput
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="• • • • • • •"
                renderRight={
                  <PasswordEyeButton visible={showPassword} onChange={setShowPassword} />
                }
              />
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <Input
                  id="remember-me-checkbox"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 bg-black-90 border border-black-50 rounded-sm focus:ring focus:ring-primary cursor-pointer accent-primary"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <p
                onClick={() => !isBtnDisabled && router.push(ROUTES.forgotPassword)}
                className={`text-sm text-red cursor-pointer hover:text-red-400 transition tracking-wide ${
                  isBtnDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Forgot Password?
              </p>
            </div>

            {/* Sign In Button */}
            <Button type="submit" onClick={onSubmit} disabled={isBtnDisabled} loading={isSigningIn}>
              Sign In
            </Button>
          </FormProvider>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-black-70"></div>
            <span className="text-black-50 text-sm">Or</span>
            <div className="flex-1 h-px bg-black-70"></div>
          </div>

          {/* Google Sign In */}
          <Button
            onClick={() =>
              handleGoogleAuth({ provider: "google", queryParams: { prompt: "select_account" } })
            }
            variant={"outline"}
            loading={isProviderSigning}
            disabled={isBtnDisabled}
          >
            <GoogleIcon size={18} className="tracking-wide" />
            Continue With Google
          </Button>

          {/* Sign Up Link */}
          <div className="text-center space-x-2 text-sm">
            <span className="text-black-50">{`Don't have an account ?`}</span>
            <span className="text-black-50 text-lg">|</span>
            <span
              onClick={() => router.push(ROUTES.signup)}
              className="text-primary hover:text-primary-dark font-bold transition cursor-pointer"
            >
              Sign Up
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LoginPage;
