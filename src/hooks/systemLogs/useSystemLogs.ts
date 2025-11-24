import { is404Error, removeDuplicatesById } from "@/lib/utils";
import { useGetAllSystemLogsQuery } from "@/store/api/systemLogApi";
import { SystemLogResponse } from "@/types/systemLogs";
import { RobotPageParams } from "@/types/urlParams";
import { useParams } from "next/navigation";

import { useEffect, useState } from "react";

interface Props {
  limit: number;
}

export const useSystemLogs = ({ limit }: Props) => {
  const { robotId } = useParams<RobotPageParams>();

  const [logs, setLogs] = useState<SystemLogResponse[]>([]);
  const [lastDocId, setLastDocId] = useState<string | undefined>(undefined);

  // hook recall when lastDocId changes
  const { data, isLoading, isFetching, error } = useGetAllSystemLogsQuery({
    robotId,
    limit,
    ...(lastDocId && { lastDocId }),
  });

  useEffect(() => {
    if (!data?.data) return;
    setLogs((prev) => [...prev, ...(data.data ?? [])]);
  }, [data]);

  const fetchMore = () => {
    if (data?.data?.length === limit) {
      setLastDocId(data.data[data.data.length - 1].id); // use last log’s id
    }
  };

  return {
    systemLogs: removeDuplicatesById([...logs, ...(data?.data ?? [])]),
    systemLogsLoading: isLoading,
    systemLogsFetching: isFetching,
    is404: is404Error(error),
    hasMore: data?.data?.length === limit,
    fetchMore,
  };
};
