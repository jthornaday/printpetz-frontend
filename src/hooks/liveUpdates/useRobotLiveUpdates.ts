import { is404Error } from "@/lib/utils";
import { useGetAllLiveUpdatesQuery } from "@/store/api/liveUpdatesApi";
import { RobotPageParams } from "@/types/urlParams";
import { useParams } from "next/navigation";

export const useAllRobotLiveUpdates = (pollingInterval: number = 10000) => {
  const { projectId } = useParams<RobotPageParams>();

  const { data, isLoading, ...rest } = useGetAllLiveUpdatesQuery(
    { projectId },
    { pollingInterval, refetchOnMountOrArgChange: true }
  );

  return {
    liveUpdates: data?.data,
    liveUpdatesLoading: isLoading,
    is404: is404Error(rest?.error),
    ...rest,
  };
};
