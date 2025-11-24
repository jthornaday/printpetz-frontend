import { IUser } from "@/types/user";
import { supabaseBaseApi } from "./baseApi";
import { supabase } from "@/services/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { supabaseErrors } from "@/utils/constants/appConstants";

const createErrorResponse = (error: PostgrestError) => {
  const message = supabaseErrors[error.code ?? ""] ?? error.message;
  return { error: { code: error.code, status: 400, message } };
};

export const userApi = supabaseBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ----------------------------------------------------------
    // GET USER BY ID
    // ----------------------------------------------------------
    getUserById: builder.query<IUser | null, string>({
      async queryFn(id) {
        try {
          const { data, error } = await supabase.from("users").select("*").eq("id", id).single();

          if (error) return createErrorResponse(error);
          return { data: data as IUser };
        } catch (error) {
          return createErrorResponse(error as PostgrestError);
        }
      },
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // ----------------------------------------------------------
    // UPDATE USER
    // ----------------------------------------------------------
    updateUser: builder.mutation<IUser, { id: string; updates: Partial<IUser> }>({
      async queryFn({ id, updates }) {
        try {
          const { data, error } = await supabase
            .from("users")
            .update(updates)
            .eq("id", id)
            .select("*")
            .single();

          if (error) return createErrorResponse(error);
          return { data };
        } catch (error) {
          return createErrorResponse(error as PostgrestError);
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }, "User"],
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useUpdateUserMutation,
  usePrefetch: useAuthPrefetch,
} = userApi;
