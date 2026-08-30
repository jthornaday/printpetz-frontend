import { supabase } from "@/services/supabase";
import { serverBaseApi, supabaseBaseApi } from "./baseApi";
import { ApiResponse } from "@/types/api";
import {
  GenerateImageRequest,
  GenerateImageResponse,
  GetGenerationByIdRequest,
  GetGenerationsRequest,
  IGeneration,
  IGenerationView,
} from "@/types/generation";
import { PostgrestError } from "@supabase/supabase-js";
import { supabaseErrors } from "@/utils/constants/appConstants";

const createErrorResponse = (error: PostgrestError) => {
  const message = supabaseErrors[error.code ?? ""] ?? error.message;
  return { error: { code: error.code, status: 400, message } };
};

export const serverGenerationApi = serverBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    generateImage: builder.mutation<ApiResponse<GenerateImageResponse>, GenerateImageRequest>({
      query: (data) => ({
        url: `generation/create`,
        method: "POST",
        body: data,
      }),
    }),
    downloadGenerationImage: builder.mutation<Blob, { id: number }>({
      query: ({ id }) => ({
        url: `generation/${id}/download`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
    editImageLook: builder.mutation<
      ApiResponse<{ imageUrl: string }>,
      { imageUrl: string; look: "natural" | "mascot" | "cartoon" }
    >({
      query: (data) => ({
        url: `generation/edit-look`,
        method: "POST",
        body: data,
      }),
    }),
    removeImageBackground: builder.mutation<
      ApiResponse<{ imageUrl: string }>,
      { imageUrl: string }
    >({
      query: (data) => ({
        url: `generation/remove-background`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const supabaseGenerationApi = supabaseBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getInfiniteGenerationViews: builder.infiniteQuery<
      IGenerationView[],
      GetGenerationsRequest,
      number
    >({
      providesTags: ["Generation"],
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam) =>
          lastPage.length < 10 ? undefined : lastPageParam + 1,
      },
      async queryFn({ queryArg: { user_id, limit = 10 }, pageParam }) {
        const offset = pageParam * limit;
        try {
          const { data, error } = await supabase
            .from("generation_view")
            .select("*")
            .eq("user_id", user_id)
            .order("group_id", { ascending: false })
            .range(offset, offset + limit - 1);

          if (error) return createErrorResponse(error);
          return { data: data as IGenerationView[] };
        } catch (error) {
          return createErrorResponse(error as PostgrestError);
        }
      },
    }),
    getGenerationById: builder.query<IGeneration, GetGenerationByIdRequest>({
      providesTags: ["Generation"],
      async queryFn({ id }) {
        try {
          const { data, error } = await supabase
            .from("generations")
            .select("*")
            .eq("id", id)
            .single();

          if (error) return createErrorResponse(error);
          return { data: data as IGeneration };
        } catch (error) {
          return createErrorResponse(error as PostgrestError);
        }
      },
    }),
    deleteGeneration: builder.mutation<void, { id: number; user_id: string }>({
      invalidatesTags: ["Generation"],
      async queryFn({ id, user_id }) {
        try {
          const { error } = await supabase
            .from("generations")
            .delete()
            .eq("id", id)
            .eq("user_id", user_id);

          if (error) return createErrorResponse(error);
          return { data: undefined };
        } catch (error) {
          return createErrorResponse(error as PostgrestError);
        }
      },
    }),
  }),
});

export const {
  useGenerateImageMutation,
  useDownloadGenerationImageMutation,
  useEditImageLookMutation,
  useRemoveImageBackgroundMutation,
  usePrefetch: useAuthPrefetch,
} = serverGenerationApi;
export const {
  useLazyGetGenerationByIdQuery,
  useGetInfiniteGenerationViewsInfiniteQuery,
  useDeleteGenerationMutation,
} = supabaseGenerationApi;
