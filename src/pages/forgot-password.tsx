import React, { useState } from "react";
import Logo from "../utils/images/logo.png";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { Button } from "@/components/ui/button";
import { ArrowIcon } from "@/components/icons";
import { ControlledInput } from "@/components/ui/form/ControlledInput";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "@/lib/validations/login";
import { IForgotPasswordRequest } from "@/types/auth";
import { ROUTES } from "@/routes";
import { useRouter } from "next/router";
import { Footer } from "@/components/shared/Footer";
import { useToast } from "@/hooks/useToast";
import { useForgotPasswordMutation } from "@/store/api/authApi";
import { EToastType } from "@/types/toast";

const ForgotPasswordPage = () => {
  const router = useRouter();

  const { toast } = useToast();

  const [sendResetPasswordLink, { isLoading }] = useForgotPasswordMutation();

  const methods = useForm<IForgotPasswordRequest>({
    defaultValues: { email: "" },
    resolver: yupResolver(forgotPasswordSchema),
  });
  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async ({ email }) => {
    const { error } = await sendResetPasswordLink({
      email,
      redirectTo: window.location.origin + ROUTES.resetPassword,
    });
    if (error) {
      toast(EToastType.ERROR, error?.message ?? "Something went wrong");
      return;
    }

    toast(EToastType.SUCCESS, "Please check your mail");
  });

  return (
    <div className="relative w-full lg:w-1/2 flex items-center justify-center px-6 md:px-12 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-14 mb-20">
        {/* Logo */}
        <div className="relative w-44 h-[68px] text-center">
          <CustomImagePreview image={Logo} />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-1">Forgot Password</h2>
          <p className="text-black-40 text-sm">Reset or New password</p>
        </div>

        <div className="flex flex-col w-full gap-14">
          <p className="text-black-40 text-center text-sm px-14">
            Enter the email associated with your account and we’ll send an email with instructions
            to reset your password.
          </p>

          {/* Form */}
          <FormProvider {...methods}>
            <div className="flex flex-col gap-14">
              {/* Email Input */}
              <ControlledInput name="email" label="Email" placeholder="name@sample.com" />

              <div className="flex flex-col w-full gap-4">
                {/* Send Code Button */}
                <Button type="submit" onClick={onSubmit} disabled={isLoading} loading={isLoading}>
                  Send Code
                </Button>

                {/* Resend Link */}
                {/* <div className="text-center space-x-2 text-sm">
                  <span className="text-black-50">{`Didn’t receive the mail ?`}</span>
                  <span className="text-black-50 text-lg">|</span>
                  <span
                    onClick={() => router.reload()}
                    className="text-primary hover:text-primary-dark font-bold transition cursor-pointer"
                  >
                    Resend
                  </span>
                </div> */}
              </div>
            </div>
          </FormProvider>
        </div>

        {/* Back to Sign In Link */}
        <Button
          onClick={() => router.push(ROUTES.login)}
          variant={"link"}
          className="font-semibold text-black-40 w-fit m-auto"
        >
          <ArrowIcon color="#A7A7C7" />
          Back to Log In
        </Button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
