import { MagicSparkIcon } from "@/components/icons";
import { GenerationItem } from "@/components/pages/shared/GenerationItem";
import { GenerationPreviewDialog } from "@/components/pages/shared/GenerationPreviewDialog";
import { Loader } from "@/components/ui/loader";
import { useLazyGetGenerationByIdQuery } from "@/store/api/generationApi";
import { EGenerationStatus, IGenerationViewItem } from "@/types/generation";
import { IModel } from "@/types/model";
import { IStyle } from "@/types/style";
import { useEffect, useMemo, useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useGetUser } from "@/hooks/user/useGetUser";
import { getModelName } from "@/utils/app_utils";
import { useGetGenerationViews } from "@/hooks/generation/useGetGenerationViews";

interface ISelectedGeneration extends IGenerationViewItem {
  style: IStyle;
  model: IModel;
}

export const Generations = () => {
  const [selectedGeneration, setSelectedGeneration] = useState<ISelectedGeneration | null>(null);

  const { user } = useGetUser();

  const {
    generationViews,
    isGenerationViewsFetching,
    isGenerationViewsLoading,
    fetchNextPage,
    hasNextPage,
    refetchGenerationViews,
  } = useGetGenerationViews(user?.id);
  const [fetchGenerationById] = useLazyGetGenerationByIdQuery();

  const { observerTarget, isLoadingMore } = useInfiniteScroll({
    hasMore: hasNextPage,
    isFetching: isGenerationViewsFetching,
    onLoadMore: () => fetchNextPage(),
  });

  const generatingIds = useMemo(() => {
    const ids: number[] = [];
    generationViews?.forEach((view) => {
      view.generations.forEach((gen) => {
        if (gen.status === EGenerationStatus.GENERATING) {
          ids.push(gen.id);
        }
      });
    });
    return ids;
  }, [generationViews]);

  useEffect(() => {
    if (!user?.id || generatingIds.length === 0) return;

    const interval = setInterval(async () => {
      for (const id of generatingIds) {
        try {
          const result = await fetchGenerationById({ id }).unwrap();

          if (result.status === EGenerationStatus.GENERATING) return;

          refetchGenerationViews();
        } catch (error) {
          console.error(`Failed to fetch generation ${id}:`, error);
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [generatingIds, fetchGenerationById, user?.id]);

  if (!generationViews || isGenerationViewsLoading) {
    return (
      <div className="flex-1 flex flex-col gap-6 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!generationViews?.length) {
    return (
      <div className="flex-1 flex flex-col gap-6 items-center justify-center">
        <MagicSparkIcon size={48} />
        <div className="text-center">
          <p className="text-[#171524] font-bold text-lg">Your creations will appear here</p>
          <p className="text-black-40">Start creating amazing images of your Pet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 pb-1 overflow-y-auto">
      <div className="flex flex-col gap-6">
        {generationViews.map((generationView) => {
          return (
            <div key={generationView.group_id}>
              <div className="flex gap-3 ">
                {[generationView.style.name, getModelName(generationView.model.name)].map(
                  (item, i) => (
                    <div key={i} className="bg-black-90 px-4 py-2 rounded-lg text-sm">
                      {item}
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 mt-2 bg-black-90 p-2 rounded-lg">
                {generationView.generations.map((generation) => (
                  <GenerationItem
                    key={generation.id}
                    generation={generation}
                    onClick={() =>
                      setSelectedGeneration({
                        ...generation,
                        style: generationView.style,
                        model: generationView.model,
                      })
                    }
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div ref={observerTarget} className="flex justify-center items-center min-h-[20px]">
        {hasNextPage && isLoadingMore && <Loader size={16} />}
      </div>

      {selectedGeneration && (
        <GenerationPreviewDialog
          generation={selectedGeneration}
          chips={[selectedGeneration.style.name, getModelName(selectedGeneration.model.name)]}
          modelId={selectedGeneration.model.id}
          styleId={selectedGeneration.style.id}
          onClose={() => setSelectedGeneration(null)}
        />
      )}
    </div>
  );
};
