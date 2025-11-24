import type {
  IForgotPasswordRequest,
  ILoginRequest,
  IResendOtpRequest,
  IResetPasswordRequest,
  ISignupRequest,
} from "@/types/auth";
import { supabaseBaseApi } from "./baseApi";
import { AuthError, Provider } from "@supabase/supabase-js";
import { supabase } from "@/services/supabase";
import { supabaseErrors } from "@/utils/constants/appConstants";

interface IVerifyOtpArgs {
  email: string;
  otp: string;
}

interface IOAuthArgs {
  provider: Provider;
  queryParams?: { [key: string]: string };
}

const createErrorResponse = (error: AuthError) => {
  const message = supabaseErrors[error.code ?? ""] ?? error.message;
  return { error: { code: error.code, status: error.status, message } };
};

export const clientApi = supabaseBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    signUpWithEmail: builder.mutation({
      async queryFn({ email, password }: ISignupRequest) {
        try {
          const { error, data } = await supabase.auth.signUp({ email, password });
          if (error) return createErrorResponse(error);
          return { data };
        } catch (error) {
          return createErrorResponse(error as AuthError);
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),
    signInWithEmail: builder.mutation({
      async queryFn({ email, password }: ILoginRequest) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) return createErrorResponse(error);
          return { data };
        } catch (error) {
          return createErrorResponse(error as AuthError);
        }
      },
    }),
    signOut: builder.mutation({
      async queryFn() {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) return createErrorResponse(error);
          return { data: {} };
        } catch (error) {
          return createErrorResponse(error as AuthError);
        }
      },
    }),
    resendEmailOtp: builder.mutation({
      async queryFn({ email }: IResendOtpRequest) {
        try {
          const { error, data } = await supabase.auth.resend({
            type: "signup",
            email,
          });
          if (error) return createErrorResponse(error);
          return { data };
        } catch (error) {
          return createErrorResponse(error as AuthError);
        }
      },
    }),
    verifyEmailOtp: builder.mutation({
      async queryFn({ email, otp }: IVerifyOtpArgs) {
        try {
          const { error, data } = await supabase.auth.verifyOtp({
            type: "email",
            token: otp,
            email,
          });
          if (error) return createErrorResponse(error);
          return { data };
        } catch (error) {
          return createErrorResponse(error as AuthError);
        }
      },
    }),
    signInWithProvider: builder.mutation({
      async queryFn({ provider, queryParams }: IOAuthArgs) {
        try {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: { queryParams },
          });
          if (error) return createErrorResponse(error);
          return { data };
        } catch (error) {
          return createErrorResponse(error as AuthError);
        }
      },
    }),
    forgotPassword: builder.mutation({
      async queryFn({ email, redirectTo }: IForgotPasswordRequest) {
        try {
          console.log("heree", { email, redirectTo });

          const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectTo ?? window.location.href,
          });
          if (error) return createErrorResponse(error);
          return { data };
        } catch (error) {
          return createErrorResponse(error as AuthError);
        }
      },
    }),
    updatePassword: builder.mutation({
      async queryFn({ email, password }: IResetPasswordRequest) {
        try {
          const { error, data } = await supabase.auth.updateUser({
            email,
            password,
          });
          if (error) return createErrorResponse(error);
          return { data };
        } catch (error) {
          return createErrorResponse(error as AuthError);
        }
      },
    }),
  }),
});

export const {
  useSignUpWithEmailMutation,
  useSignInWithEmailMutation,
  useSignOutMutation,
  useVerifyEmailOtpMutation,
  useSignInWithProviderMutation,
  useForgotPasswordMutation,
  useResendEmailOtpMutation,
  useUpdatePasswordMutation,
  usePrefetch: useAuthPrefetch,
} = clientApi;
