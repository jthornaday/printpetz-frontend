import { serverBaseApi } from "./baseApi";
import { ApiResponse } from "@/types/api";
import { CheckoutRequest, CheckoutResponse } from "@/types/payment";

export const paymentApi = serverBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ----------------------------------------------------------
    // Create Checkout Session
    // ----------------------------------------------------------
    createCheckoutSession: builder.mutation<ApiResponse<CheckoutResponse>, CheckoutRequest>({
      query: ({ priceId }) => {
        const body = {
          priceId,
          redirectUrl: window.location.origin + window.location.pathname,
        };

        return {
          url: `stripe/checkout`,
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useCreateCheckoutSessionMutation } = paymentApi;
