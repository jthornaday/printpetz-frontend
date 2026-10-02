import { supabaseBaseApi } from "./baseApi";
import { supabase } from "@/services/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { supabaseErrors } from "@/utils/constants/appConstants";
import { GetPricesParams, IPrice } from "@/types/price";

const createErrorResponse = (error: PostgrestError) => {
  const message = supabaseErrors[error.code ?? ""] ?? error.message;
  return { error: { code: error.code, status: 400, message } };
};

export const priceApi = supabaseBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ----------------------------------------------------------
    // GET Prices
    // ----------------------------------------------------------
    getPrices: builder.query<IPrice[], GetPricesParams>({
      async queryFn() {
        try {
          // Only packs that are on sale: archiving a price in Stripe sets is_active false via the
          // price.updated webhook, which is how the old test-mode packs are retired at launch.
          const { data, error } = await supabase
            .from("prices")
            .select("*")
            .eq("is_active", true)
            .order("id");

          if (error) return createErrorResponse(error);
          return { data: data as IPrice[] };
        } catch (error) {
          return createErrorResponse(error as PostgrestError);
        }
      },
      keepUnusedDataFor: 3600,
      providesTags: (result) =>
        result
          ? [
              ...result.map((price) => ({
                type: "Price" as const,
                id: price.id,
              })),
              { type: "Price", id: "LIST" },
            ]
          : [{ type: "Price", id: "LIST" }],
    }),
  }),
});

export const { useGetPricesQuery, useLazyGetPricesQuery, usePrefetch: usePricePrefetch } = priceApi;
