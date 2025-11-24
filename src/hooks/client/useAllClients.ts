import { is404Error } from "@/lib/utils";
import { useGetAllClientsQuery } from "@/store/api/clientApi";

export const useAllClients = () => {
  const { data, isLoading, ...rest } = useGetAllClientsQuery({});

  return {
    clients: data?.data,
    clientsLoading: isLoading,
    is404: is404Error(rest?.error),
    ...rest,
  };
};
