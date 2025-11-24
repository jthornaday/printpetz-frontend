import { useGenerateImageMutation, useGetGenerationViewsQuery } from "@/store/api/generationApi";
import { useState } from "react";
import { ModelSelector } from "./components/ModelSelector";
import { StyleSelector } from "./components/StyleSelector";
import { GenerationControls } from "./components/GenerationControl";
import { Button } from "@/components/ui/button";
import { Generations } from "./components/Generations";
import { IStyle } from "@/types/style";
import { IModel } from "@/types/model";
import { useAppSelector } from "@/store";
import { useGetUserByIdQuery } from "@/store/api/userApi";

export const Create = () => {
  const [selectedModel, setSelectedModel] = useState<IModel | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<IStyle | null>(null);
  const [numberOfGenerations, setNumberOfGenerations] = useState(2);

  const { user } = useAppSelector((state) => state.auth);
  const { refetch } = useGetGenerationViewsQuery({ user_id: user!.id });
  const { refetch: refetchUser } = useGetUserByIdQuery(user?.id || "", { skip: !user });

  const [generateImage, { isLoading: isGenerating }] = useGenerateImageMutation();

  const handleGenerate = async () => {
    if (!selectedModel || !selectedStyle) return;

    try {
      await generateImage({
        modelId: selectedModel.id,
        styleId: selectedStyle.id,
        numberOfImages: numberOfGenerations,
      }).unwrap();
      
      // Refetch generation views after successful generation
      refetch();
      refetchUser();
    } catch (error) {
      console.error("Failed to generate image:", error);
    }
  };

  return (
    <div className="flex w-full">
      {/* Left Panel - Controls */}
      <div className="w-100 h-full border-r border-gray-800 overflow-y-auto flex flex-col gap-3 p-5">
        <h1 className="text-white text-xl font-bold">Generate Images</h1>

        <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />

        <StyleSelector selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle} />

        <GenerationControls
          numberOfGenerations={numberOfGenerations}
          setNumberOfGenerations={setNumberOfGenerations}
        />

        <div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
          <p className="text-black-40 text-xs text-center mt-2">2 Credits used per generation</p>
        </div>
      </div>

      {/* Right Panel - Results */}
      <div id="generations-portal" className="relative flex-1 flex flex-col">
        <Generations />
      </div>
    </div>
  );
};
