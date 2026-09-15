import { supabaseBaseApi } from "./baseApi";
import { supabase } from "@/services/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { supabaseErrors } from "@/utils/constants/appConstants";
import { GetStylesParams, IStyle } from "@/types/style";

const createErrorResponse = (error: PostgrestError) => {
  const message = supabaseErrors[error.code ?? ""] ?? error.message;
  return { error: { code: error.code, status: 400, message } };
};

export const styleApi = supabaseBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ----------------------------------------------------------
    // GET Styles
    // ----------------------------------------------------------
    getStyles: builder.query<IStyle[], GetStylesParams>({
      async queryFn() {
        try {
          // is_active is the picker's only gate. A theme is hidden by setting
          // the flag false, never by deleting the row or changing its category:
          // generations.style_id references these rows and past orders would
          // break.
          const { data, error } = await supabase
            .from("styles")
            .select("*")
            .eq("is_active", true)
            .order("id");

          if (error) return createErrorResponse(error);
          return { data: data as IStyle[] };
        } catch (error) {
          return createErrorResponse(error as PostgrestError);
        }
      },
      keepUnusedDataFor: 3600,
      providesTags: (result) =>
        result
          ? [
              ...result.map((style) => ({
                type: "Style" as const,
                id: style.id,
              })),
              { type: "Style", id: "LIST" },
            ]
          : [{ type: "Style", id: "LIST" }],
    }),
  }),
});

export const { useGetStylesQuery, useLazyGetStylesQuery, usePrefetch: useAuthPrefetch } = styleApi;
