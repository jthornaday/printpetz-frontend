import { useGetModelsQuery } from "@/store/api/modelApi";
import { skipToken } from "@reduxjs/toolkit/query";

export const useGetModels = (user_id?: string) => {
  const { data, isLoading, isFetching, isUninitialized, ...rest } = useGetModelsQuery(
    user_id ? { user_id } : skipToken
  );

  return {
    models: data ?? [],
    isModelsLoading: isLoading || isUninitialized,
    isModelsFetching: isFetching || isUninitialized,
    ...rest,
  };
};
