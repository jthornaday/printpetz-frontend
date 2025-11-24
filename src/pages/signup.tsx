import React, { useState } from "react";
import Logo from "../utils/images/logo.png";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { ControlledInput } from "@/components/ui/form/ControlledInput";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "@/lib/validations/login";
import { ISignupRequest } from "@/types/auth";
import { PasswordEyeButton } from "@/components/ui/passwordEyeButton";
import { ROUTES } from "@/routes";
import { useRouter } from "next/router";
import { Footer } from "@/components/shared/Footer";
import { useSignInWithProviderMutation, useSignUpWithEmailMutation } from "@/store/api/authApi";
import { useToast } from "@/hooks/useToast";
import { setSupabaseAuthUser } from "@/store/slices/supabaseUserSlice";
import { useDispatch } from "react-redux";

const SignupPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [handleGoogleAuth, { isLoading: isGoogleButtonLoading }] = useSignInWithProviderMutation();
  const [handleSignup, { isLoading: isSignupButtonLoading }] = useSignUpWithEmailMutation();

  const methods = useForm<ISignupRequest>({
    defaultValues: { email: "", password: "", confirmPassword: "" },
    resolver: yupResolver(signupSchema),
  });
  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, error } = await handleSignup(formData);
    if (error || !data.user) {
      toast("ERROR", error?.message ?? "Something went wrong");
      return;
    }

    dispatch(setSupabaseAuthUser(data.user));
    router.push(ROUTES.verification);
  });

  return (
    <div className="relative w-full lg:w-1/2 flex items-center justify-center px-6 md:px-12 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-14 mb-14">
        {/* Logo */}
        <div className="relative w-44 h-[68px] text-center">
          <CustomImagePreview image={Logo} />
        </div>

        {/* Welcome Text */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-1.5">Let’s Create An Account</h2>
          <p className="text-black-40">Fill the details to Create your Account</p>
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

              {/* Confirm Password Input */}
              <ControlledInput
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="• • • • • • •"
                renderRight={
                  <PasswordEyeButton
                    visible={showConfirmPassword}
                    onChange={setShowConfirmPassword}
                  />
                }
              />
            </div>

            {/* Remember Me */}
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
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              onClick={onSubmit}
              disabled={isSignupButtonLoading}
              loading={isSignupButtonLoading}
            >
              Sign Up
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
            onClick={() => handleGoogleAuth({ provider: "google" })}
            variant={"outline"}
            loading={isGoogleButtonLoading}
            disabled={isGoogleButtonLoading}
          >
            <GoogleIcon size={18} className="tracking-wide" />
            Continue With Google
          </Button>

          {/* Sign Up Link */}
          <div className="text-center space-x-2 text-sm">
            <span className="text-black-50">{`Already have an account ?`}</span>
            <span className="text-black-50 text-lg">|</span>
            <span
              onClick={() => router.push(ROUTES.login)}
              className="text-primary hover:text-primary-dark font-bold transition cursor-pointer"
            >
              Sign In
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SignupPage;
