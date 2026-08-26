import React, { useEffect, useState } from "react";
import { PrintPetzWordmark } from "@/components/shared/PrintPetzWordmark";
import { Button } from "@/components/ui/button";
import { ArrowIcon } from "@/components/icons";
import { ControlledInput } from "@/components/ui/form/ControlledInput";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "@/lib/validations/login";
import { IResetPasswordRequest } from "@/types/auth";
import { Footer } from "@/components/shared/Footer";
import { PasswordEyeButton } from "@/components/ui/passwordEyeButton";
import { useSignOutMutation, useUpdatePasswordMutation } from "@/store/api/authApi";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/hooks/useToast";
import { useGetUser } from "@/hooks/user/useGetUser";
import { EToastType } from "@/types/toast";

const ResetPasswordPage = () => {
  const { toast } = useToast();

  const { user } = useGetUser();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [handleSignOut] = useSignOutMutation();
  const [updatePassword, { isLoading: isPasswordUpdating }] = useUpdatePasswordMutation();

  const methods = useForm<IResetPasswordRequest>({
    defaultValues: { email: "", password: "", confirmPassword: "" },
    resolver: yupResolver(resetPasswordSchema),
  });
  const { reset, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    if (!user) return;

    const { data, error } = await updatePassword(formData);
    if (error || !data.user) {
      toast(EToastType.ERROR, error?.message ?? "Something went wrong");
      return;
    }

    toast(EToastType.SUCCESS, "All set! Your password has been reset.");
    handleSignOut({});
  });

  useEffect(() => {
    if (!user) return;

    reset({ email: user.email, password: "", confirmPassword: "" });
  }, [user]);

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="relative w-full lg:w-1/2 flex items-center justify-center px-6 md:px-12 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-14 mb-20">
        {/* Logo */}
        <div className="flex h-[68px] items-center justify-center">
          <PrintPetzWordmark />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-1">Reset Password</h2>
          <p className="text-black-40 text-sm">Set New Password</p>
        </div>

        <div className="flex flex-col w-full gap-5">
          {/* Form */}
          <FormProvider {...methods}>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                {/* Password Input */}
                <ControlledInput
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  renderRight={
                    <PasswordEyeButton visible={showPassword} onChange={setShowPassword} />
                  }
                />

                {/* Confirm Password Input */}
                <ControlledInput
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter Your Password"
                  renderRight={
                    <PasswordEyeButton
                      visible={showConfirmPassword}
                      onChange={setShowConfirmPassword}
                    />
                  }
                />
              </div>

              {/* Reset Button */}
              <Button
                type="submit"
                onClick={onSubmit}
                disabled={isPasswordUpdating}
                loading={isPasswordUpdating}
              >
                Reset
              </Button>
            </div>
          </FormProvider>
        </div>

        {/* Back to Sign In Link */}
        <Button
          onClick={handleSignOut}
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

export default ResetPasswordPage;
