import { useEffect, useState } from "react";
import { NoHistory } from "./components/NoHistory";
import { GenerationItem } from "../shared/GenerationItem";
import { GenerationPreviewDialog } from "../shared/GenerationPreviewDialog";
import { IGenerationView, IGenerationViewItem } from "@/types/generation";
import { useGetInfiniteGenerationViewsInfiniteQuery } from "@/store/api/generationApi";
import { IStyle } from "@/types/style";
import { IModel } from "@/types/model";
import { Loader } from "@/components/ui/loader";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useGetUserByIdQuery } from "@/store/api/userApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { getModelName } from "@/utils/app_utils";
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
  const [allGenerations, setAllGenerations] = useState<IGenerationView[]>([]);

  // Infinite scroll hook
  const { observerTarget, isLoadingMore } = useInfiniteScroll({
    hasMore: hasNextPage,
    isFetching,
    onLoadMore: () => fetchNextPage(),
  });

  useEffect(() => {
    if (generationViews) {
      setAllGenerations(generationViews.pages.flat());
    }
  }, [generationViews]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!generationViews?.pages.length) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <NoHistory />
      </div>
    );
  }

  return (
    <>
      <div className="relative flex-1 flex flex-col gap-1.5 overflow-y-auto p-5 pb-1">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 bg-black-90 p-2 rounded-lg">
          {allGenerations.map((generationView) => {
            return generationView.generations.map((generation) => (
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
