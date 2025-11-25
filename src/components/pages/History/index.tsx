import { useEffect, useState } from "react";
import { NoHistory } from "./components/NoHistory";
import { GenerationItem } from "../shared/GenerationItem";
import { GenerationPreviewDialog } from "../shared/GenerationPreviewDialog";
import { IGeneration, IGenerationView, IGenerationViewItem } from "@/types/generation";
import {
  useGetInfiniteGenerationsInfiniteQuery,
  useGetInfiniteGenerationViewsInfiniteQuery,
} from "@/store/api/generationApi";
import { useAppSelector } from "@/store";
import { IStyle } from "@/types/style";
import { IModel } from "@/types/model";
import { Loader } from "@/components/ui/loader";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

// Extended interface to include style and model from the view
interface IExtendedGeneration extends IGenerationViewItem {
  group_id: number;
  style: IStyle;
  model: IModel;
}

export const History = () => {
  const { user } = useAppSelector((state) => state.auth);
  const {
    data: generationViews,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteGenerationViewsInfiniteQuery({ user_id: user!.id });

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
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto p-5">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 mt-2 bg-black-90 p-2 rounded-lg">
          {allGenerations.map((generationView, index) => {
            return (
              <GenerationItem
                key={`${generationView.group_id}-${generationView.generations[0].id}`}
                generation={generationView.generations[0]}
                onClick={() =>
                  setSelectedGeneration({
                    ...generationView.generations[0],
                    group_id: generationView.group_id,
                    style: generationView.style,
                    model: generationView.model,
                  })
                }
              />
            );
          })}
        </div>

        {/* Infinite scroll trigger */}
        {hasNextPage && (
          <div ref={observerTarget} className="flex justify-center py-4">
            {isLoadingMore && <Loader />}
          </div>
        )}
      </div>

      {selectedGeneration && (
        <GenerationPreviewDialog
          generation={selectedGeneration}
          chips={[selectedGeneration.style.name, selectedGeneration.model.name]}
          onClose={() => setSelectedGeneration(null)}
        />
      )}
    </>
  );
};
