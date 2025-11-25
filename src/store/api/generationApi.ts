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
    // ----------------------------------------------------------
    // Generate Image
    // ----------------------------------------------------------
    generateImage: builder.mutation<ApiResponse<GenerateImageResponse>, GenerateImageRequest>({
      query: (data) => ({
        url: `generation/create`,
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
    getInfiniteGenerations: builder.infiniteQuery<IGeneration[], GetGenerationsRequest, number>({
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam) =>
          lastPage.length < 20 ? undefined : lastPageParam + 1,
      },
      async queryFn({ queryArg: { user_id, limit = 20 }, pageParam }) {
        const offset = pageParam * limit;
        try {
          const { data, error } = await supabase
            .from("generations")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

          if (error) return createErrorResponse(error);
          return { data: data as IGeneration[] };
        } catch (error) {
          return createErrorResponse(error as PostgrestError);
        }
      },
    }),
    // ----------------------------------------------------------
    // Get Generations
    // ----------------------------------------------------------
    getGenerationViews: builder.query<IGenerationView[], GetGenerationsRequest>({
      async queryFn({ user_id, limit = 10, offset = 0 }) {
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
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems) => {
        currentCache.push(...newItems);
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        const channel = supabase
          .channel(`generation_view:${arg.user_id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "generation_view",
              filter: `user_id=eq.${arg.user_id}`,
            },
            (payload) => {
              updateCachedData((draft) => {
                if (payload.eventType === "INSERT") {
                  const newView = payload.new as IGenerationView;
                  // Add to the beginning of the list
                  draft.unshift(newView);
                } else if (payload.eventType === "UPDATE") {
                  const updatedView = payload.new as IGenerationView;
                  const index = draft.findIndex((view) => view.group_id === updatedView.group_id);
                  if (index !== -1) {
                    draft[index] = updatedView;
                  }
                } else if (payload.eventType === "DELETE") {
                  const deletedView = payload.old as IGenerationView;
                  const index = draft.findIndex((view) => view.group_id === deletedView.group_id);
                  if (index !== -1) {
                    draft.splice(index, 1);
                  }
                }
              });
            }
          )
          .subscribe();

        await cacheDataLoaded;

        await cacheEntryRemoved;
        channel.unsubscribe();
      },
    }),
    // ----------------------------------------------------------
    // Get Generation By ID
    // ----------------------------------------------------------
    getGenerationById: builder.query<IGeneration, GetGenerationByIdRequest>({
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
  }),
});

export const { useGenerateImageMutation, usePrefetch: useAuthPrefetch } = serverGenerationApi;
export const {
  useGetGenerationViewsQuery,
  useLazyGetGenerationViewsQuery,
  useLazyGetGenerationByIdQuery,
  useGetInfiniteGenerationViewsInfiniteQuery,
  useGetInfiniteGenerationsInfiniteQuery,
} = supabaseGenerationApi;
