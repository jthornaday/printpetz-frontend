import { auth } from "@/services/supabase/client";
import { SupabaseCustomAuthError } from "@/types/auth";
import {
  BaseQueryFn,
  createApi,
  fakeBaseQuery,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

export const supabaseAuthApi = createApi({
  reducerPath: "supabase-auth-api",
  baseQuery: fakeBaseQuery<SupabaseCustomAuthError>(),
  tagTypes: ["Auth"],
  endpoints: () => ({}),
});

export const supabaseBaseApi = createApi({
  reducerPath: "supabase-api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User", "Style", "Model", "Price", "Generation"],
  endpoints: () => ({}),
});

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
  prepareHeaders: async (headers, { endpoint }) => {
    try {
      const { data } = await auth.getSession();
      if (data.session) {
        const token = data.session.access_token;
        headers.set("authorization", `Bearer ${token}`);
      }

      // Do not pass when upload multipart formData
      if (endpoint !== "uploadFile") {
        headers.set("content-type", "application/json");
      }
    } catch (error) {
      console.error("Error getting Firebase token:", error);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    try {
      // Force refresh the token and retry
      const { data } = await auth.getSession();
      if (data.session) {
        result = await baseQuery(args, api, extraOptions);
      }
    } catch (error) {
      await auth.signOut();
      return { error: { status: 401, data: "Unauthorized" } as FetchBaseQueryError };
    }
  }

  return result;
};

export const serverBaseApi = createApi({
  reducerPath: "server-api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Model"],
  endpoints: () => ({}),
  refetchOnReconnect: true,
});
