import { useEffect, useState } from "react";
import { NoHistory } from "./components/NoHistory";
import { GenerationItem } from "../shared/GenerationItem";
import { GenerationPreviewDialog } from "../shared/GenerationPreviewDialog";
import {
  EGenerationStatus,
  IGenerationViewDateGroup,
  IGenerationViewItem,
} from "@/types/generation";
import { useGetInfiniteGenerationViewsInfiniteQuery } from "@/store/api/generationApi";
import { IStyle } from "@/types/style";
import { IModel } from "@/types/model";
import { Loader } from "@/components/ui/loader";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useGetUserByIdQuery } from "@/store/api/userApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { formatDateForDisplay, getModelName } from "@/utils/app_utils";

// Extended interface to include style and model from the view
interface IExtendedGeneration extends IGenerationViewItem {
  group_id: number;
  style: IStyle;
  model: IModel;
}

export const History = () => {
  const { data } = useGetUserByIdQuery();
  const { data: user } = data || {};

  const {
    data: generationViews,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteGenerationViewsInfiniteQuery(user ? { user_id: user.id } : skipToken);

  const [selectedGeneration, setSelectedGeneration] = useState<IExtendedGeneration | null>(null);
  const [generationViewsGroupedByDate, setGenerationViewsGroupedByDate] = useState<
    IGenerationViewDateGroup[]
  >([]);

  // Infinite scroll hook
  const { observerTarget, isLoadingMore } = useInfiniteScroll({
    hasMore: hasNextPage,
    isFetching,
    onLoadMore: () => fetchNextPage(),
  });

  useEffect(() => {
    if (!generationViews) return;

    const timer = setTimeout(() => {
      const formattedData = generationViews.pages.flat().reduce((acc, genView) => {
        const displayDate = formatDateForDisplay(new Date(genView.created_at));
        const existingDateGroup = acc.find((v) => v.displayDate === displayDate);

        if (existingDateGroup) {
          existingDateGroup.generationViews.push(genView);
          return acc;
        }

        // add only if generation is not generating
        const hasOtherThanGenerating = genView.generations.some(
          (g) => g.status !== EGenerationStatus.GENERATING
        );
        if (hasOtherThanGenerating) {
          acc.push({ displayDate, generationViews: [genView] });
        }

        return acc;
      }, [] as IGenerationViewDateGroup[]);

      setGenerationViewsGroupedByDate(formattedData);
    }, 0);

    return () => clearTimeout(timer);
  }, [generationViews]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!generationViews?.pages?.[0].length) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <NoHistory />
      </div>
    );
  }

  return (
    <>
      <div className="relative flex-1 flex flex-col gap-1.5 overflow-y-auto p-5 pb-1">
        <div className="flex flex-col gap-6">
          {generationViewsGroupedByDate.map((generationViewGroup) => {
            const { generationViews, displayDate } = generationViewGroup;

            return (
              <div key={displayDate}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-black-50 text-sm font-semibold">{displayDate}</p>
                  <span className="flex-1 h-[1px] bg-black-60" />
                </div>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 bg-black-90 p-2 rounded-lg">
                  {generationViews.map((generationView) => {
                    const generations = generationView.generations.filter(
                      (g) => g.status !== EGenerationStatus.GENERATING
                    );

                    return generations.map((generation) => (
                      <GenerationItem
                        key={generation.id}
                        generation={generation}
                        onClick={() =>
                          setSelectedGeneration({
                            ...generation,
                            group_id: generationView.group_id,
                            style: generationView.style,
                            model: generationView.model,
                          })
                        }
                      />
                    ));
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Infinite scroll trigger */}
        <div ref={observerTarget} className="flex justify-center items-center min-h-[20px]">
          {hasNextPage && isLoadingMore && <Loader size={16} />}
        </div>
      </div>

      {selectedGeneration && (
        <GenerationPreviewDialog
          generation={selectedGeneration}
          chips={[selectedGeneration.style.name, getModelName(selectedGeneration.model.name)]}
          onClose={() => setSelectedGeneration(null)}
        />
      )}
    </>
  );
};
