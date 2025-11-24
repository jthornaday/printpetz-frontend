import { is404Error } from "@/lib/utils";
import { useGetProjectByIdQuery } from "@/store/api/projectApi";
import { ProjectResponse } from "@/types/projects";
import { ProjectPageParams } from "@/types/urlParams";
import { useParams } from "next/navigation";

export const useProjectById = () => {
  const { projectId } = useParams<ProjectPageParams>();

  const { data, isLoading, ...rest } = useGetProjectByIdQuery(
    { id: projectId },
    { skip: !projectId }
  );

  return {
    project: data?.data as ProjectResponse,
    projectLoading: isLoading,
    is404: is404Error(rest?.error),
    ...rest,
  };
};
