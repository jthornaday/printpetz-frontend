import { serverBaseApi } from "./baseApi";
import { ApiResponse } from "@/types/api";
import { FileUploadRequest, FileUploadResponse } from "@/types/file";

export const modelApi = serverBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ----------------------------------------------------------
    // Upload File
    // ----------------------------------------------------------
    uploadFile: builder.mutation<ApiResponse<FileUploadResponse>, FileUploadRequest>({
      query: ({ files, type }) => {
        const formData = new FormData();
        files.map((file) => formData.append("file", file));

        return {
          url: `file/upload?type=${encodeURIComponent(type)}`,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const { useUploadFileMutation, usePrefetch: useAuthPrefetch } = modelApi;
