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
          const { data, error } = await supabase.from("styles").select("*").order("id");

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
