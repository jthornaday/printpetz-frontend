import { MagicSparkIcon } from "@/components/icons";
import { GenerationItem } from "@/components/pages/shared/GenerationItem";
import { GenerationPreviewDialog } from "@/components/pages/shared/GenerationPreviewDialog";
import { Loader } from "@/components/ui/loader";
import { useAppSelector } from "@/store";
import {
  useGetInfiniteGenerationViewsInfiniteQuery,
  useLazyGetGenerationByIdQuery,
} from "@/store/api/generationApi";
import { EGenerationStatus, IGenerationView, IGenerationViewItem } from "@/types/generation";
import { IModel } from "@/types/model";
import { IStyle } from "@/types/style";
import { useEffect, useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface ISelectedGeneration extends IGenerationViewItem {
  style: IStyle;
  model: IModel;
}

const ITEMS_PER_PAGE = 10;

export const Generations = () => {
  const [selectedGeneration, setSelectedGeneration] = useState<ISelectedGeneration | null>(null);
  const [allGenerations, setAllGenerations] = useState<IGenerationView[]>([]);

  const { user } = useAppSelector((state) => state.auth);

  const {
    data: generationViews,
    isFetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useGetInfiniteGenerationViewsInfiniteQuery({
    user_id: user!.id,
    limit: ITEMS_PER_PAGE,
  });
  const [fetchGenerationById] = useLazyGetGenerationByIdQuery();

  // Infinite scroll hook
  const { observerTarget, isLoadingMore } = useInfiniteScroll({
    hasMore: hasNextPage,
    isFetching,
    onLoadMore: () => fetchNextPage(),
  });

  // Accumulate generations as we paginate
  useEffect(() => {
    if (generationViews) {
      setAllGenerations(generationViews.pages.flat());
    }
  }, [generationViews]);

  // Poll every 4 seconds for generations with GENERATING status
  useEffect(() => {
    const generatingIds: number[] = [];

    allGenerations?.forEach((view) => {
      view.generations.forEach((gen) => {
        if (gen.status === EGenerationStatus.GENERATING) {
          generatingIds.push(gen.id);
        }
      });
    });

    if (generatingIds.length > 0) {
      const interval = setInterval(async () => {
        // Fetch each generating generation individually
        for (const id of generatingIds) {
          try {
            const result = await fetchGenerationById({ id }).unwrap();

            // Update local state
            setAllGenerations((prev) =>
              prev.map((view) => ({
                ...view,
                generations: view.generations.map((gen) =>
                  gen.id === id
                    ? {
                        id: result.id,
                        prompt: result.prompt,
                        image: result.image,
                        request_id: result.request_id,
                        status: result.status,
                        error: result.error,
                      }
                    : gen
                ),
              }))
            );
          } catch (error) {
            console.error(`Failed to fetch generation ${id}:`, error);
          }
        }
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [allGenerations, fetchGenerationById]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col gap-6 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!generationViews?.pages.length) {
    return (
      <div className="flex-1 flex flex-col gap-6 items-center justify-center">
        <MagicSparkIcon size={48} />
        <div className="text-center">
          <p className="text-white font-bold text-lg">Your creations will appear here</p>
          <p className="text-black-40">Start creating amazing images of your Pet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-y-auto p-5">
      {allGenerations.map((generationView) => {
        return (
          <div key={generationView.group_id}>
            <div className="flex gap-3 ">
              {[generationView.style.name, generationView.model.name].map((item, i) => (
                <div key={i} className="bg-black-90 px-4 py-2 rounded-lg text-sm">
                  {item}
                </div>
              ))}
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

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div ref={observerTarget} className="flex justify-center py-4">
          {isLoadingMore && <Loader />}
        </div>
      )}

      {selectedGeneration && (
        <GenerationPreviewDialog
          generation={selectedGeneration}
          chips={[selectedGeneration.style.name, selectedGeneration.model.name]}
          onClose={() => setSelectedGeneration(null)}
        />
      )}
    </div>
  );
};
