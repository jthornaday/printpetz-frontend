import { is404Error } from "@/lib/utils";
import { useGetClientByIdQuery } from "@/store/api/clientApi";
import { ClientPageParams } from "@/types/urlParams";
import { useParams } from "next/navigation";

export const useClientById = () => {
  const { clientId } = useParams<ClientPageParams>();

  const { data, isLoading, ...rest } = useGetClientByIdQuery({ id: clientId }, { skip: !clientId });

  return {
    client: data?.data,
    clientLoading: isLoading,
    is404: is404Error(rest?.error),
    ...rest,
  };
};
