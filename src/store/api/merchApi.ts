import { ApiResponse } from "@/types/api";
import { PreviewManifest } from "@/types/merch";

import { serverBaseApi } from "./baseApi";

export const merchApi = serverBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Idempotent: renders any missing previews and returns what's ready. Poll while anything is pending. */
    getMerchPreviews: builder.query<ApiResponse<PreviewManifest>, number>({
      query: (generationId) => ({ url: `merch/previews/${generationId}`, method: "GET" }),
    }),
  }),
});

export const { useGetMerchPreviewsQuery } = merchApi;
