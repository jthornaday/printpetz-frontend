import React, { useEffect, useState } from "react";
import Logo from "../utils/images/logo.png";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { Button } from "@/components/ui/button";
import { ArrowIcon } from "@/components/icons";
import { ROUTES } from "@/routes";
import { useRouter } from "next/router";
import { Footer } from "@/components/shared/Footer";
import { useAppSelector } from "@/store";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { otpVerificationSchema } from "@/lib/validations/login";
import { IVerificationRequest } from "@/types/auth";
import { useResendEmailOtpMutation, useVerifyEmailOtpMutation } from "@/store/api/authApi";
import { useToast } from "@/hooks/useToast";
import { Loader } from "@/components/ui/loader";

type Props = {
  handleSetOtp: (otp: string) => void;
};

const OtpField = ({ handleSetOtp }: Props) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const otpBoxReference: React.RefObject<HTMLInputElement | null>[] = Array.from(
    { length: 6 },
    () => React.createRef()
  );

  const numberOfDigits = 6;
  function handleChange(value: string, index: number) {
    const numericValue = value.replace(/[^0-9]/g, "");
    const newArr = [...otp];
    newArr[index] = numericValue;
    setOtp(newArr);

    if (numericValue && index < numberOfDigits - 1) {
      otpBoxReference[index + 1].current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === "Backspace" && index > 0) {
      if (!e.currentTarget.value) {
        // Handle backspace to focus on the previous input and remove the digit
        const newArr = [...otp];
        newArr[index - 1] = "";
        setOtp(newArr);
        otpBoxReference[index - 1].current?.focus();
      } else if (
        e.currentTarget.selectionStart === 0 &&
        e.currentTarget.selectionEnd === e.currentTarget.value.length &&
        e.currentTarget.selectionDirection === "backward"
      ) {
        // Handle backspace when the entire content is selected
        const newArr = [...otp];
        newArr[index] = "";
        setOtp(newArr);
        if (index > 0) {
          otpBoxReference[index - 1].current?.focus();
        }
      }
    }
    if (e.key === "Enter" && e.currentTarget.value && index < numberOfDigits - 1) {
      otpBoxReference[index + 1].current?.focus();
    }
  }

  const handleOnClick = () => {
    const otpLength = otp.join("").length;
    if (otpBoxReference[otpLength]) {
      otpBoxReference[otpLength].current?.focus();
      return;
    }
    otpBoxReference[otpLength - 1].current?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pasteData)) return;

    const digits = pasteData.split("").slice(0, 6);
    const newOtp = [...otp];
    digits.forEach((d, i) => {
      newOtp[i] = d;
      if (otpBoxReference[i]) otpBoxReference[i].current!.value = d;
    });
    setOtp(newOtp);

    // focus last filled input
    const last = Math.min(digits.length, 5);
    otpBoxReference[last].current?.focus();
  };

  useEffect(() => {
    handleSetOtp(otp.join(""));
  }, [otp]);

  useEffect(() => {
    otpBoxReference[0].current?.focus();
  }, []);

  return (
    <div className="flex items-center justify-center gap-2.5">
      {otp.map((digit, index) => (
        <input
          key={index}
          value={digit}
          maxLength={1}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={otpBoxReference[index]}
          className={`border w-[50px] aspect-square text-white p-3 text-center rounded-lg focus:text-primary caret-transparent focus:border-primary focus:outline-none appearance-none border-black-70 ${
            digit ? "bg-black-80" : ""
          }`}
          onPaste={handlePaste}
          onClick={handleOnClick}
        />
      ))}
    </div>
  );
};

const VerificationPage = () => {
  const router = useRouter();

  const { toast } = useToast();

  const sessionUser = useAppSelector((state) => state.sessionUser);

  const [verifyEmailOtp, { isLoading: isOtpVerifying }] = useVerifyEmailOtpMutation();
  const [resendEmailOtp, { isLoading: isOtpResending }] = useResendEmailOtpMutation();

  const methods = useForm<IVerificationRequest>({
    defaultValues: { otp: "" },
    resolver: yupResolver(otpVerificationSchema),
  });
  const { handleSubmit, reset, watch } = methods;

  const onSubmit = handleSubmit(async ({ otp }) => {
    if (!sessionUser?.email) return;

    const { data, error } = await verifyEmailOtp({ email: sessionUser.email, otp });
    if (error || !data.user) {
      toast("ERROR", error?.message ?? "Something went wrong");
      return;
    }
  });

  const handleResendEmailOtp = async () => {
    if (!sessionUser?.email) return;

    const { error } = await resendEmailOtp({ email: sessionUser.email });
    if (error) {
      toast("ERROR", error?.message ?? "Something went wrong");
      return;
    }

    toast("SUCCESS", "Please check your mail");
  };

  const handleSetOtp = (otp: string) => {
    reset({ otp });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sessionUser) {
        router.push(ROUTES.signup);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [sessionUser]);

  if (!sessionUser) {
    return <Loader />;
  }

  return (
    <div className="relative w-full lg:w-1/2 flex items-center justify-center px-6 md:px-12 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-14 mb-20">
        {/* Logo */}
        <div className="relative w-44 h-[68px] text-center">
          <CustomImagePreview image={Logo} />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-1.5">Check Your Mail</h2>
          <p className="text-black-40">Verify your mail</p>
        </div>

        <div className="text-center">
          <p className="text-black-40 max-w-sm">
            please enter the code we sent to <span className="text-white">{sessionUser.email}</span>
          </p>
        </div>

        <OtpField handleSetOtp={handleSetOtp} />

        <div className="flex flex-col w-full gap-4">
          {/* Verify Email Button */}
          <Button
            type="button"
            onClick={onSubmit}
            disabled={watch("otp").length !== 6 || isOtpVerifying}
            loading={isOtpVerifying}
          >
            Verify Email
          </Button>

          {/* Verify Email Link */}
          <div className="text-center space-x-2 text-sm">
            <span className="text-black-50">{`Didn’t receive the mail ?`}</span>
            <span className="text-black-50 text-lg">|</span>
            <span
              onClick={handleResendEmailOtp}
              className="text-primary hover:text-primary-dark font-bold transition cursor-pointer"
            >
              {isOtpResending ? "Resending..." : "Resend"}
            </span>
          </div>
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

export default VerificationPage;
