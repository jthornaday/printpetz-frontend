import type {
  IForgotPasswordRequest,
  ILoginRequest,
  IResendOtpRequest,
  IResetPasswordRequest,
  ISignupRequest,
} from "@/types/auth";
import { supabaseAuthApi } from "./baseApi";
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

const withRetry = async <T>(
  fn: () => Promise<{ data: T; error: null } | { data: unknown; error: AuthError }>,
  retries = 3,
  delay = 1000
) => {
  let lastError: AuthError | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const { data, error } = await fn();
      if (!error) return { data };

      lastError = error;
      // Only retry on 500+ errors
      if (!error.status || error.status < 500) {
        return createErrorResponse(error);
      }

      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      lastError = error as AuthError;
      if (i === retries) break;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return createErrorResponse(lastError!);
};

export const clientApi = supabaseAuthApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    signUpWithEmail: builder.mutation({
      async queryFn({ email, password }: ISignupRequest) {
        return withRetry(() => supabase.auth.signUp({ email, password }));
      },
      invalidatesTags: ["Auth"],
    }),
    signInWithEmail: builder.mutation({
      async queryFn({ email, password }: ILoginRequest) {
        return withRetry(() => supabase.auth.signInWithPassword({ email, password }));
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
        return withRetry(() => supabase.auth.resend({ type: "signup", email }));
      },
    }),
    verifyEmailOtp: builder.mutation({
      async queryFn({ email, otp }: IVerifyOtpArgs) {
        return withRetry(() =>
          supabase.auth.verifyOtp({
            type: "email",
            token: otp,
            email,
          })
        );
      },
    }),
    signInWithProvider: builder.mutation({
      async queryFn({ provider, queryParams }: IOAuthArgs) {
        return withRetry(() =>
          supabase.auth.signInWithOAuth({
            provider,
            options: { queryParams },
          })
        );
      },
    }),
    forgotPassword: builder.mutation({
      async queryFn({ email, redirectTo }: IForgotPasswordRequest) {
        return withRetry(() =>
          supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectTo ?? window.location.href,
          })
        );
      },
    }),
    updatePassword: builder.mutation({
      async queryFn({ email, password }: IResetPasswordRequest) {
        return withRetry(() =>
          supabase.auth.updateUser({
            email,
            password,
          })
        );
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
