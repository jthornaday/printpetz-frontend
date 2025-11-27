import { ApiResponse } from "./../../types/api";
import { IUser } from "@/types/user";
import { supabaseBaseApi } from "./baseApi";
import { supabase } from "@/services/supabase";
import { PostgrestError } from "@supabase/supabase-js";

const createErrorResponse = (error: PostgrestError) => {
  const message = error.message;
  return { data: null, message, success: false };
};

export const userApi = supabaseBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ----------------------------------------------------------
    // GET USER BY ID
    // ----------------------------------------------------------
    getUserById: builder.query<ApiResponse<IUser | null>, void>({
      async queryFn() {
        // get user if from auth
        const {
          data: { user },
        } = await supabase.auth.getUser();

        console.log({ user });

        if (!user) {
          // logout user
          await supabase.auth.signOut();
          return { data: { success: false, data: null, message: "User not authenticated" } };
        }

        try {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error) return { data: createErrorResponse(error) };
          return { data: { success: true, data: data as IUser } };
        } catch (error) {
          return { data: { success: false, data: null, message: "Something went wrong" } };
        }
      },
      providesTags: (result) => [{ type: "User", id: result?.data?.id }],
    }),

    // ----------------------------------------------------------
    // UPDATE USER
    // ----------------------------------------------------------
    updateUser: builder.mutation<ApiResponse<IUser | null>, Partial<IUser> & { id: string }>({
      async queryFn({ id, ...dataToUpdate }) {
        try {
          const { data, error } = await supabase
            .from("users")
            .update(dataToUpdate)
            .eq("id", id)
            .select("*")
            .single();

          if (error) return { data: createErrorResponse(error) };
          return { data: { success: true, data: data as IUser } };
        } catch (error) {
          return { data: { success: false, data: null, message: "Something went wrong" } };
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
