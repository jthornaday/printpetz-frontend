import { is404Error } from "@/lib/utils";
import { useGetAllProjectsQuery } from "@/store/api/projectApi";
import { ClientPageParams } from "@/types/urlParams";
import { useParams } from "next/navigation";

export const useAllProjects = () => {
  const { clientId } = useParams<ClientPageParams>();

  const { data, isLoading, ...rest } = useGetAllProjectsQuery(
    { clientId },
    { skip: !clientId, refetchOnMountOrArgChange: true }
  );

  return {
    projects: data?.data,
    projectsLoading: isLoading,
    is404: is404Error(rest?.error),
    ...rest,
  };
};
