import { useGetInfiniteGenerationViewsInfiniteQuery } from "@/store/api/generationApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useMemo } from "react";

export const useGetGenerationViews = (user_id?: string) => {
  const { data, isLoading, isFetching, isUninitialized, refetch, ...rest } =
    useGetInfiniteGenerationViewsInfiniteQuery(user_id ? { user_id } : skipToken);

  const generationViews = useMemo(() => data?.pages.flatMap((page) => page) ?? [], [data?.pages]);

  return {
    generationViews,
    isGenerationViewsLoading: isLoading || isUninitialized,
    isGenerationViewsFetching: isFetching || isUninitialized,
    refetchGenerationViews: refetch,
    ...rest,
  };
};
