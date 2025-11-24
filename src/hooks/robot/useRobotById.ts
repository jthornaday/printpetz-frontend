import { is404Error } from "@/lib/utils";
import { useGetRobotByIdQuery } from "@/store/api/robotApi";
import { RobotPageParams } from "@/types/urlParams";
import { useParams } from "next/navigation";

export const useRobotById = () => {
  const { robotId } = useParams<RobotPageParams>();

  const { data, isLoading, ...rest } = useGetRobotByIdQuery({ id: robotId }, { skip: !robotId });

  return {
    robot: data?.data,
    robotLoading: isLoading,
    is404: is404Error(rest?.error),
    ...rest,
  };
};
