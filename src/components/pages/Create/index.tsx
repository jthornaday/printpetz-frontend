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
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ROUTES } from "@/routes";

const cutenessLabels: Record<number, string> = {
  1: "Natural",
  2: "Cute",
  3: "Extra Cute",
  4: "Super Cute",
  5: "Stop It, Cute!",
};

export const Create = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [selectedModel, setSelectedModel] = useState<IModel | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<IStyle | null>(null);
  const [numberOfGenerations, setNumberOfGenerations] = useState(2);
  const [cutenessLevel, setCutenessLevel] = useState(2);
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);

  const { user, isUserLoading, refetch: refetchUser } = useGetUser();
  const { refetchGenerationViews } = useGetGenerationViews(user?.id);
  const [generateImage, { isLoading: isGenerating }] = useGenerateImageMutation();

  useEffect(() => {
    if (!router.isReady || router.query.purchase !== "success") return;

    refetchUser();
    toast(EToastType.SUCCESS, "Credits added—you're ready to create!");
    router.replace(ROUTES.create, undefined, { shallow: true });
  }, [refetchUser, router, toast]);

  const handleGenerate = async () => {
    if (!selectedModel || !selectedStyle) return;

    try {
      const response = await generateImage({
        modelId: selectedModel.id,
        styleId: selectedStyle.id,
        numberOfImages: numberOfGenerations,
        cutenessLevel,
      }).unwrap();
      const { success, data, message } = response;
      if (!success || !data) {
        toast(EToastType.ERROR, message ?? "Failed to generate image");
        return;
      }

      refetchUser();
      refetchGenerationViews();
    } catch (error: unknown) {
      const apiError = error as ApiError;

      if (apiError?.status === 403) {
        setShowCreditsDialog(true);
        return;
      }

      const message = apiError?.data?.message || "Failed to generate image";
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
    <div className="min-w-0 flex-1 bg-[#f8f7fb]">
      <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-5 p-4 sm:p-6 xl:flex-row xl:items-start xl:p-8">
        <aside className="order-1 w-full shrink-0 xl:sticky xl:top-5 xl:w-[430px]">
          <div className="rounded-2xl border border-[#e7e2ee] bg-white shadow-sm xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto">
            <div className="p-4 sm:p-5">
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-black-40">Create setup</p>
                <h2 className="mt-1 text-lg font-bold text-[#171524]">Build your look</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">1</span>
                    <span className="text-sm font-bold text-[#171524]">Choose your pet</span>
                  </div>
                  <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">2</span>
                    <span className="text-sm font-bold text-[#171524]">Choose a style</span>
                  </div>
                  <StyleSelector selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle} />
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">3</span>
                    <span className="text-sm font-bold text-[#171524]">Fine-tune it</span>
                  </div>
                  <GenerationControls
                    numberOfGenerations={numberOfGenerations}
                    setNumberOfGenerations={setNumberOfGenerations}
                    cutenessLevel={cutenessLevel}
                    setCutenessLevel={setCutenessLevel}
                  />
                </div>

                <div className="rounded-xl border border-[#e7e2ee] bg-[#fcfbff] p-3">
                  <div className="mb-3 flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-black-40">Your setup</span>
                    <span className="font-bold text-[#171524]">
                      {numberOfGenerations * 2} credits
                    </span>
                  </div>
                  <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-white p-2">
                      <p className="text-black-40">Pet</p>
                      <p className="truncate font-bold text-[#171524]">{selectedModel?.name ?? "Not selected"}</p>
                    </div>
                    <div className="rounded-lg bg-white p-2">
                      <p className="text-black-40">Style</p>
                      <p className="truncate font-bold text-[#171524]">{selectedStyle?.name ?? "Not selected"}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerateButtonDisabled}
                    loading={isGenerating}
                    className="w-full rounded-xl py-3 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {selectedModel && selectedStyle ? `Create ${numberOfGenerations} image${numberOfGenerations > 1 ? "s" : ""}` : "Choose pet & style"}
                  </Button>
                  <p className="mt-2 text-center text-xs text-black-40">2 credits per image</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="order-2 min-w-0 flex-1">
          <div className="mb-4 rounded-2xl border border-[#e7e2ee] bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">PrintPetz Studio</p>
                <h1 className="mt-1 text-2xl font-bold text-[#171524]">Create your pet artwork</h1>
                <p className="mt-1 text-sm text-black-40">
                  Pick your pet, choose a look, set the cuteness, then generate.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-black-90 px-3 py-1.5 text-black-30">
                  {selectedModel?.name ?? "Choose pet"}
                </span>
                <span className="rounded-full bg-black-90 px-3 py-1.5 text-black-30">
                  {selectedStyle?.name ?? "Choose style"}
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1.5 text-primary">
                  {cutenessLabels[cutenessLevel]}
                </span>
              </div>
            </div>
          </div>

          <div
            id="generations-portal"
            className="relative min-h-[58vh] min-w-0 overflow-hidden rounded-2xl border border-[#e7e2ee] bg-white"
          >
            <Generations />
          </div>
        </section>
      </div>

      <InsufficientCreditsDialog
        open={showCreditsDialog}
        onClose={() => setShowCreditsDialog(false)}
      />
    </div>
  );
};
