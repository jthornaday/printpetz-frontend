import React, { useEffect, useState } from "react";
import { PrintPetzWordmark } from "@/components/shared/PrintPetzWordmark";
import { Button } from "@/components/ui/button";
import { SocialSignIn } from "@/components/shared/SocialSignIn";
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
} from "@/store/api/authApi";
import { useToast } from "@/hooks/useToast";
import { EToastType } from "@/types/toast";

const LoginPage = () => {
  const router = useRouter();

  const { toast } = useToast();

  useEffect(() => {
    if (!router.isReady || !router.query.error) return;
    toast(EToastType.ERROR, "Sign-in wasn’t completed. Please try again or choose another option.");
    router.replace("/login", undefined, { shallow: true });
  }, [router, toast]);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [isProviderSigning, setProviderSigning] = useState(false);
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
    <div className="relative w-full lg:w-1/2 flex items-center justify-center bg-white px-6 md:px-12 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-7 mb-20">
        {/* Logo */}
        <button
          type="button"
          aria-label="Go to PrintPetz home"
          className="flex h-[68px] items-center justify-center cursor-pointer"
          onClick={() => router.push(ROUTES.landing)}
        >
          <PrintPetzWordmark />
        </button>

        {/* Welcome Text */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-1.5">Welcome to PrintPetz</h2>
          <p className="text-black-40">Your next great portrait starts here.</p>
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
                  className="w-4 h-4 bg-white border border-black-60 rounded-sm focus:ring focus:ring-primary cursor-pointer accent-primary"
                />
                <span className="text-sm text-black-40">Remember me</span>
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

          <SocialSignIn disabled={isBtnDisabled} onBusyChange={setProviderSigning} />

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
