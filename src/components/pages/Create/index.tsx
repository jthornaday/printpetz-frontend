import { useGenerateImageMutation } from "@/store/api/generationApi";
import { useRef, useState } from "react";
import { InsufficientCreditsDialog } from "@/components/shared/InsufficientCreditsDialog";
import { ModelSelector } from "./components/ModelSelector";
import { StyleSelector } from "./components/StyleSelector";
import { GenerationControls } from "./components/GenerationControl";
import { Button } from "@/components/ui/button";
import { IStyle } from "@/types/style";
import { IModel } from "@/types/model";
import { useGetUser } from "@/hooks/user/useGetUser";
import { useToast } from "@/hooks/useToast";
import { EToastType } from "@/types/toast";
import { ApiError } from "@/types/api";
import { useGetGenerationViews } from "@/hooks/generation/useGetGenerationViews";
import { usePollGeneratingViews } from "@/hooks/generation/usePollGeneratingViews";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { EGenerationStatus } from "@/types/generation";
import { Loader } from "@/components/ui/loader";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ROUTES } from "@/routes";
import { useAppDispatch, useAppSelector } from "@/store";
import { setAppContext } from "@/store/slices/appContextSlice";

const DEFAULT_LOOK_LEVEL = 1; // Natural

export const Create = () => {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [selectedModel, setSelectedModel] = useState<IModel | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<IStyle | null>(null);
  const [numberOfGenerations, setNumberOfGenerations] = useState(2);
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);

  const { user, isUserLoading, refetch: refetchUser } = useGetUser();
  const { generationViews, refetchGenerationViews } = useGetGenerationViews(user?.id);
  const [generateImage, { isLoading: isSubmitting }] = useGenerateImageMutation();

  // The create request returns as soon as the images are queued, so the
  // mutation's loading state ends long before the batch does. Track the batch
  // this session started and treat it as in progress until none of its images
  // is still generating. A batch not in the list yet is one whose refetch
  // hasn't landed, so it counts as in progress too.
  const activeGeneration = useAppSelector((state) => state.appContext.activeGeneration);
  const activeGroupId =
    activeGeneration && activeGeneration.userId === user?.id ? activeGeneration.groupId : null;
  const activeView = generationViews.find((view) => view.group_id === activeGroupId);
  const isBatchGenerating =
    activeGroupId !== null &&
    (!activeView ||
      activeView.generations.some((gen) => gen.status === EGenerationStatus.GENERATING));
  const isGenerating = isSubmitting || isBatchGenerating;

  // The gallery that used to poll lives on Gallery now. Without polling here the
  // batch would never be seen to finish and Generate would stay disabled.
  usePollGeneratingViews(generationViews, refetchGenerationViews);

  // Catches a second click that lands before the disabled state re-renders.
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (!router.isReady || router.query.purchase !== "success") return;

    refetchUser();
    toast(EToastType.SUCCESS, "You're all set — time to create your pet!");
    dispatch(setAppContext({ isModelTrainingDialogOpen: true }));
    router.replace(ROUTES.create, undefined, { shallow: true });
  }, [dispatch, refetchUser, router, toast]);

  const handleGenerate = async () => {
    if (!selectedModel || !selectedStyle || isGenerating || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    try {
      const response = await generateImage({
        modelId: selectedModel.id,
        styleId: selectedStyle.id,
        numberOfImages: numberOfGenerations,
        cutenessLevel: DEFAULT_LOOK_LEVEL,
      }).unwrap();
      const { success, data, message } = response;
      if (!success || !data) {
        toast(EToastType.ERROR, message ?? "Failed to generate image");
        return;
      }

      const groupId = data.generations.find(Boolean)?.group_id;
      if (groupId && user) {
        dispatch(setAppContext({ activeGeneration: { userId: user.id, groupId } }));
      }

      refetchUser();
      refetchGenerationViews();
      // In-progress and finished images show on Gallery. Only on success, so
      // errors and the out-of-credits dialog still appear here.
      router.push(ROUTES.history);
    } catch (error: unknown) {
      const apiError = error as ApiError;

      if (apiError?.status === 403) {
        setShowCreditsDialog(true);
        return;
      }

      const message = apiError?.data?.message || "Failed to generate image";
      toast(EToastType.ERROR, message);
    } finally {
      isSubmittingRef.current = false;
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

  const stepBadge = (step: number) => (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
      {step}
    </span>
  );

  return (
    <div className="pg-workspace min-w-0 flex-1 bg-[#f5f7fb]">
      {/* One column at every width: pet, then style, then review and generate.
          Past creations live on Gallery. */}
      <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-5 p-4 sm:p-6 xl:p-8">
        <div className="rounded-2xl border border-[#e7e2ee] bg-white p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">PrintPetz Studio</p>
          <h1 className="pg-studio-heading mt-1 text-2xl text-[#171524]">Their next great portrait</h1>
          <p className="mt-1 text-sm text-black-40">
            Choose your pet and theme. Your new creations will appear in Gallery, ready to review and refine.
          </p>
        </div>

        <section className="rounded-2xl border border-[#e7e2ee] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-2 flex items-center gap-2">
            {stepBadge(1)}
            <span className="text-sm font-bold text-[#171524]">Choose your pet</span>
          </div>
          <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
        </section>

        <section className="rounded-2xl border border-[#e7e2ee] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-2 flex items-center gap-2">
            {stepBadge(2)}
            <span className="text-sm font-bold text-[#171524]">Choose a theme</span>
          </div>
          <StyleSelector selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle} />
        </section>

        <section className="rounded-2xl border border-primary/30 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-1 flex items-center gap-2">
            {stepBadge(3)}
            <span className="text-sm font-bold text-[#171524]">Review and generate</span>
          </div>
          <p className="mb-4 text-sm text-black-40">
            Check your pet and style before you spend credits. Nothing is charged until you press
            Create.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-[#e7e2ee] bg-[#fcfbff] p-3">
              <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-black-80">
                {selectedModel?.training_images?.[0] && (
                  <img
                    src={selectedModel.training_images[0]}
                    alt={selectedModel.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-black-40">Pet</p>
                <p className="truncate font-bold text-[#171524]">{selectedModel?.name ?? "Not selected"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#e7e2ee] bg-[#fcfbff] p-3">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-black-80">
                {selectedStyle?.image && (
                  <CustomImagePreview
                    image={selectedStyle.image}
                    alt={selectedStyle.name}
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-black-40">Style</p>
                <p className="truncate font-bold text-[#171524]">{selectedStyle?.name ?? "Not selected"}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <GenerationControls
              numberOfGenerations={numberOfGenerations}
              setNumberOfGenerations={setNumberOfGenerations}
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-bold text-[#171524]">{numberOfGenerations * 2} credits</p>
              <p className="text-xs text-black-40">2 credits per image</p>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerateButtonDisabled}
              loading={isGenerating}
              className="w-full rounded-xl px-8 py-3 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {selectedModel && selectedStyle ? `Create ${numberOfGenerations} image${numberOfGenerations > 1 ? "s" : ""}` : "Choose pet & style"}
            </Button>
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
