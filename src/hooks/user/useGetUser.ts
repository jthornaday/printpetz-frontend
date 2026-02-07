import { useGetUserQuery } from "@/store/api/userApi";

export const useGetUser = () => {
  const { data, isLoading, isFetching, isUninitialized, ...rest } = useGetUserQuery();

  return {
    user: data?.data ?? null,
    isUserLoading: isLoading || isUninitialized,
    isUserFetching: isFetching || isUninitialized,
    ...rest,
  };
};
