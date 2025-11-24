import { useState } from "react";
import { NoHistory } from "./components/NoHistory";
import { GenerationItem } from "../shared/GenerationItem";
import { GenerationPreviewDialog } from "../shared/GenerationPreviewDialog";
import { IGenerationViewItem } from "@/types/generation";
import { useGetGenerationViewsQuery } from "@/store/api/generationApi";
import { useAppSelector } from "@/store";
import { IStyle } from "@/types/style";
import { IModel } from "@/types/model";

// Extended interface to include style and model from the view
interface IExtendedGeneration extends IGenerationViewItem {
  group_id: number;
  style: IStyle;
  model: IModel;
}

export const History = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: generationViews = [], isLoading } = useGetGenerationViewsQuery(
    { user_id: user?.id || "" },
    { skip: !user?.id }
  );

  const [selectedGeneration, setSelectedGeneration] = useState<IExtendedGeneration | null>(null);

  // Flatten all generations from all views and sort in descending order
  const allGenerations = generationViews
    .flatMap((view) =>
      view.generations.map((gen) => ({
        ...gen,
        group_id: view.group_id,
        style: view.style,
        model: view.model,
      }))
    )
    .sort((a, b) => b.group_id - a.group_id);

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!allGenerations.length) {
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
          {allGenerations.map((generation, index) => {
            return (
              <GenerationItem
                key={`${generation.group_id}-${generation.id}`}
                generation={generation}
                onClick={() => setSelectedGeneration(generation)}
              />
            );
          })}
        </div>
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
