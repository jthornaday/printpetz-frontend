import { MagicSparkIcon } from "@/components/icons";
import { GenerationItem } from "@/components/pages/shared/GenerationItem";
import { GenerationPreviewDialog } from "@/components/pages/shared/GenerationPreviewDialog";
import { Loader } from "@/components/ui/loader";
import { useAppDispatch, useAppSelector } from "@/store";
import { supabaseGenerationApi, useGetGenerationViewsQuery, useLazyGetGenerationByIdQuery } from "@/store/api/generationApi";
import { EGenerationStatus, IGenerationView, IGenerationViewItem } from "@/types/generation";
import { IModel } from "@/types/model";
import { IStyle } from "@/types/style";
import { useEffect, useState } from "react";

interface ISelectedGeneration extends IGenerationViewItem {
  style: IStyle;
  model: IModel;
}

export const Generations = () => {
  const [selectedGeneration, setSelectedGeneration] = useState<ISelectedGeneration | null>(null);

  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { data: generationViews, isFetching } = useGetGenerationViewsQuery({ user_id: user!.id });
  const [fetchGenerationById] = useLazyGetGenerationByIdQuery();

  // Poll every 2 seconds for generations with GENERATING status
  useEffect(() => {
    const generatingIds: number[] = [];
    
    generationViews?.forEach((view) => {
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
            
            // Update the cache manually using dispatch
            dispatch(
              supabaseGenerationApi.util.updateQueryData(
                'getGenerationViews',
                { user_id: user!.id },
                (draft: IGenerationView[]) => {
                  for (const view of draft) {
                    const genIndex = view.generations.findIndex((g: IGenerationViewItem) => g.id === id);
                    if (genIndex !== -1) {
                      // Update the generation with new data
                      view.generations[genIndex] = {
                        id: result.id,
                        prompt: result.prompt,
                        image: result.image,
                        request_id: result.request_id,
                        status: result.status,
                        error: result.error,
                      };
                      break;
                    }
                  }
                }
              )
            );
          } catch (error) {
            console.error(`Failed to fetch generation ${id}:`, error);
          }
        }
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [generationViews, fetchGenerationById, dispatch, user]);

  if (isFetching) {
    return <div className="flex-1 flex flex-col gap-6 items-center justify-center"><Loader /></div>;
  }

  if (!generationViews || generationViews?.length === 0) {
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
      {generationViews.map((generationView) => {
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
