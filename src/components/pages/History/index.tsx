import { useMemo, useState } from "react";
import { NoHistory } from "./components/NoHistory";
import { GenerationItem } from "../shared/GenerationItem";
import { GenerationPreviewDialog } from "../shared/GenerationPreviewDialog";
import { IGenerationViewDateGroup, IGenerationViewItem } from "@/types/generation";
import { IStyle } from "@/types/style";
import { IModel } from "@/types/model";
import { Loader } from "@/components/ui/loader";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useGetUser } from "@/hooks/user/useGetUser";
import { formatDateForDisplay, getModelName } from "@/utils/app_utils";
import { useGetGenerationViews } from "@/hooks/generation/useGetGenerationViews";
import { usePollGeneratingViews } from "@/hooks/generation/usePollGeneratingViews";

// Extended interface to include style and model from the view
interface IExtendedGeneration extends IGenerationViewItem {
  group_id: number;
  style: IStyle;
  model: IModel;
}

export const History = () => {
  const { user, refetch: refetchUser } = useGetUser();

  const {
    generationViews,
    isGenerationViewsFetching,
    isGenerationViewsLoading,
    hasNextPage,
    fetchNextPage,
    refetchGenerationViews,
  } = useGetGenerationViews(user?.id);

  // Spinners turn into images without a reload.
  usePollGeneratingViews(generationViews, refetchGenerationViews, refetchUser);

  const [selectedGeneration, setSelectedGeneration] = useState<IExtendedGeneration | null>(null);

  // Infinite scroll hook
  const { observerTarget, scrollRoot, isLoadingMore } = useInfiniteScroll({
    hasMore: hasNextPage,
    isFetching: isGenerationViewsFetching,
    onLoadMore: () => fetchNextPage(),
  });

  // Headings come from group_id, the field the list is sorted by, and a new
  // group starts whenever the day changes, so headings always follow list order.
  const generationViewsGroupedByDate = useMemo(
    () =>
      generationViews.reduce((acc, genView) => {
        const displayDate = formatDateForDisplay(genView.group_id);
        const lastDateGroup = acc[acc.length - 1];

        if (lastDateGroup?.displayDate === displayDate) {
          lastDateGroup.generationViews.push(genView);
        } else {
          acc.push({ displayDate, generationViews: [genView] });
        }

        return acc;
      }, [] as IGenerationViewDateGroup[]),
    [generationViews]
  );

  if (isGenerationViewsLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!generationViews.length) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <NoHistory />
      </div>
    );
  }

  return (
    <>
      <div
        ref={scrollRoot}
        className="relative flex-1 flex flex-col gap-1.5 overflow-y-auto p-5 pb-1"
      >
        <h1 className="text-2xl font-bold text-[#171524]">Gallery</h1>

        <div className="mt-3 flex flex-col gap-6">
          {generationViewsGroupedByDate.map((generationViewGroup) => {
            const { generationViews, displayDate } = generationViewGroup;

            return (
              <div key={generationViews[0].group_id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-black-50 text-sm font-semibold">{displayDate}</p>
                  <span className="flex-1 h-[1px] bg-black-60" />
                </div>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 bg-black-90 p-2 rounded-lg">
                  {generationViews.map((generationView) => {
                    const { model, style } = generationView;
                    const caption = `${model.pet_name ?? model.name} · ${style.name}`;

                    return generationView.generations.map((generation) => (
                      <GenerationItem
                        key={generation.id}
                        generation={generation}
                        caption={caption}
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
          modelId={selectedGeneration.model.id}
          styleId={selectedGeneration.style.id}
          onClose={() => setSelectedGeneration(null)}
        />
      )}
    </>
  );
};
