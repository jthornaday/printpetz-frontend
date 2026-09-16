import { useLazyGetGenerationByIdQuery } from "@/store/api/generationApi";
import { EGenerationStatus, IGenerationView } from "@/types/generation";
import { useEffect, useMemo } from "react";

/**
 * While any loaded generation is still GENERATING, checks each one every 4s
 * and refetches the views once one of them has finished.
 */
export const usePollGeneratingViews = (
  generationViews: IGenerationView[],
  refetchGenerationViews: () => void
) => {
  const [fetchGenerationById] = useLazyGetGenerationByIdQuery();

  const generatingIds = useMemo(() => {
    const ids: number[] = [];
    generationViews.forEach((view) => {
      view.generations.forEach((gen) => {
        if (gen.status === EGenerationStatus.GENERATING) {
          ids.push(gen.id);
        }
      });
    });
    return ids;
  }, [generationViews]);

  useEffect(() => {
    if (generatingIds.length === 0) return;

    const interval = setInterval(async () => {
      for (const id of generatingIds) {
        try {
          const result = await fetchGenerationById({ id }).unwrap();

          // `continue`, not `return`: one image still generating must not stop
          // us checking the rest of the batch, or a finished image stays hidden
          // until every image before it has also finished.
          if (result.status === EGenerationStatus.GENERATING) continue;

          refetchGenerationViews();
        } catch (error) {
          console.error(`Failed to fetch generation ${id}:`, error);
        }
      }
    }, 4000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatingIds, fetchGenerationById]);
};
