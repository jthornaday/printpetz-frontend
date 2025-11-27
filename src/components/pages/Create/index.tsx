import {
  useGenerateImageMutation,
  useGetInfiniteGenerationViewsInfiniteQuery,
} from "@/store/api/generationApi";
import { useState } from "react";
import { ModelSelector } from "./components/ModelSelector";
import { StyleSelector } from "./components/StyleSelector";
import { GenerationControls } from "./components/GenerationControl";
import { Button } from "@/components/ui/button";
import { Generations } from "./components/Generations";
import { IStyle } from "@/types/style";
import { IModel } from "@/types/model";
import { useGetUserByIdQuery } from "@/store/api/userApi";
import { skipToken } from "@reduxjs/toolkit/query";

export const Create = () => {
  const [selectedModel, setSelectedModel] = useState<IModel | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<IStyle | null>(null);
  const [numberOfGenerations, setNumberOfGenerations] = useState(2);

  const { data, refetch: refetchUser } = useGetUserByIdQuery();
  const { data: user } = data || {};

  const { refetch: refetchGenerationViews } = useGetInfiniteGenerationViewsInfiniteQuery(
    user ? { user_id: user.id } : skipToken
  );

  const [generateImage, { isLoading: isGenerating }] = useGenerateImageMutation();

  const handleGenerate = async () => {
    if (!selectedModel || !selectedStyle) return;

    try {
      await generateImage({
        modelId: selectedModel.id,
        styleId: selectedStyle.id,
        numberOfImages: numberOfGenerations,
      }).unwrap();

      // Refetch user to update credits
      refetchUser();

      // Refetch generation views to update history
      refetchGenerationViews();
    } catch (error) {
      console.error("Failed to generate image:", error);
    }
  };

  return (
    <div className="flex w-full">
      {/* Left Panel - Controls */}
      <div className="w-100 h-full border-r border-gray-800 flex flex-col gap-3 p-5">
        <h1 className="text-white text-xl font-bold">Generate Images</h1>

        <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />

        <div className="flex-1">
          <StyleSelector selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle} />
        </div>

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
