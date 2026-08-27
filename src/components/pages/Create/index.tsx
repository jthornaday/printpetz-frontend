import { useGenerateImageMutation } from "@/store/api/generationApi";
import { useState } from "react";
import { InsufficientCreditsDialog } from "@/components/shared/InsufficientCreditsDialog";
import { ModelSelector } from "./components/ModelSelector";
import { StyleSelector } from "./components/StyleSelector";
import { GenerationControls } from "./components/GenerationControl";
import { Button } from "@/components/ui/button";
import { Generations } from "./components/Generations";
import { IStyle } from "@/types/style";
import { IModel } from "@/types/model";
import { useGetUser } from "@/hooks/user/useGetUser";
import { useToast } from "@/hooks/useToast";
import { EToastType } from "@/types/toast";
import { ApiError } from "@/types/api";
import { useGetGenerationViews } from "@/hooks/generation/useGetGenerationViews";
import { Loader } from "@/components/ui/loader";

export const Create = () => {
  const { toast } = useToast();

  const [selectedModel, setSelectedModel] = useState<IModel | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<IStyle | null>(null);
  const [numberOfGenerations, setNumberOfGenerations] = useState(2);
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);

  const { user, isUserLoading, refetch: refetchUser } = useGetUser();

  const { refetchGenerationViews } = useGetGenerationViews(user?.id);

  const [generateImage, { isLoading: isGenerating }] = useGenerateImageMutation();

  const handleGenerate = async () => {
    if (!selectedModel || !selectedStyle) return;

    try {
      const response = await generateImage({
        modelId: selectedModel.id,
        styleId: selectedStyle.id,
        numberOfImages: numberOfGenerations,
      }).unwrap();
      const { success, data, message } = response;
      if (!success || !data) {
        toast(EToastType.ERROR, message ?? "Failed to generate image");
        return;
      }

      refetchUser(); // Refetch user to update credits
      refetchGenerationViews(); // Refetch generation views to update history
    } catch (error: unknown) {
      const apiError = error as ApiError;

      if (apiError?.status === 403) {
        setShowCreditsDialog(true);
        return;
      }

      const message = apiError?.data?.message || "Failed to train model";
      toast(EToastType.ERROR, message);
    }
  };

  const isGenerateButtonDisabled = !selectedModel || !selectedStyle || isGenerating;

  if (isUserLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <div className="max-w-md rounded-2xl border border-black-70 bg-black-90 p-8">
          <h1 className="text-xl font-bold text-[#171524]">We couldn&apos;t load your account</h1>
          <p className="mt-2 text-sm leading-6 text-black-40">
            Your login is safe. Try loading your profile again to continue creating.
          </p>
          <Button className="mt-6" onClick={() => refetchUser()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full">
      {/* Left Panel - Controls */}
      <div className="w-100 h-full border-r border-[#e7e2ee] bg-white flex flex-col gap-3 p-5">
        <h1 className="text-[#171524] text-xl font-bold">Create your pet artwork</h1>

        <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />

        <div className="flex-1 overflow-y-auto">
          <StyleSelector selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle} />
        </div>

        <GenerationControls
          numberOfGenerations={numberOfGenerations}
          setNumberOfGenerations={setNumberOfGenerations}
        />

        <div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerateButtonDisabled}
            loading={isGenerating}
            className="w-full py-3 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate
          </Button>
          <p className="text-black-40 text-xs text-center mt-2">2 Credits used per generation</p>
        </div>
      </div>

      {/* Right Panel - Results */}
      <div id="generations-portal" className="relative flex-1 flex flex-col">
        <Generations />
      </div>

      <InsufficientCreditsDialog
        open={showCreditsDialog}
        onClose={() => setShowCreditsDialog(false)}
      />
    </div>
  );
};
