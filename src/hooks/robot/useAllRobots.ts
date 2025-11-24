import { is404Error } from "@/lib/utils";
import { useGetAllRobotsQuery } from "@/store/api/robotApi";
import { RobotPageParams } from "@/types/urlParams";
import { useParams } from "next/navigation";

export const useAllRobots = () => {
  const { projectId } = useParams<RobotPageParams>();

  const { data, isLoading, ...rest } = useGetAllRobotsQuery(
    { projectId },
    { skip: !projectId, refetchOnMountOrArgChange: true }
  );

  return {
    robots: data?.data,
    robotsLoading: isLoading,
    is404: is404Error(rest?.error),
    ...rest,
  };
};
