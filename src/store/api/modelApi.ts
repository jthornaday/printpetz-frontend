import { serverBaseApi, supabaseBaseApi } from "./baseApi";
import { supabase } from "@/services/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { supabaseErrors } from "@/utils/constants/appConstants";
import { GetModelsParams, IModel, UpdateModelRequest } from "@/types/model";
import { ApiResponse } from "@/types/api";
import { TrainModelRequest } from "@/types/modelTraining";

const createErrorResponse = (error: PostgrestError) => {
  const message = supabaseErrors[error.code ?? ""] ?? error.message;
  return { error: { code: error.code, status: 400, message } };
};

export const supabaseModelApi = supabaseBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ----------------------------------------------------------
    // GET Models
    // ----------------------------------------------------------
    getModels: builder.query<IModel[], GetModelsParams>({
      async queryFn({ user_id }) {
        try {
          const { data, error } = await supabase
            .from("models")
            .select("*")
            .is("is_deleted", false)
            .eq("user_id", user_id)
            .order("id", { ascending: false });

          if (error) return createErrorResponse(error);
          return { data: data as IModel[] };
        } catch (error) {
          return createErrorResponse(error as PostgrestError);
        }
      },
      keepUnusedDataFor: 3600,
      providesTags: (result) =>
        result
          ? [
              ...result.map((model) => ({
                type: "Model" as const,
                id: model.id,
              })),
              { type: "Model", id: "LIST" },
            ]
          : [{ type: "Model", id: "LIST" }],
    }),
    // ----------------------------------------------------------
    // UPDATE Model
    // ----------------------------------------------------------
    updateModel: builder.mutation<IModel, UpdateModelRequest>({
      async queryFn({ id, is_deleted }) {
        try {
          const { data, error } = await supabase
            .from("models")
            .update({ is_deleted })
            .eq("id", id)
            .select()
            .single();

          if (error) return createErrorResponse(error);
          return { data: data as IModel };
        } catch (error) {
          return createErrorResponse(error as PostgrestError);
        }
      },
      invalidatesTags: [{ type: "Model", id: "LIST" }],
    }),
  }),
});

export const serverModelApi = serverBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ----------------------------------------------------------
    // Train Model
    // ----------------------------------------------------------
    trainModel: builder.mutation<ApiResponse<IModel>, TrainModelRequest>({
      query: (data) => ({
        url: `model/train`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Model", id: "LIST" }],
    }),
  }),
});

export const { useGetModelsQuery, useLazyGetModelsQuery, useUpdateModelMutation } =
  supabaseModelApi;
export const { useTrainModelMutation } = serverModelApi;
