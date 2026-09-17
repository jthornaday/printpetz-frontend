import Link from "next/link";
import { ArrowUpRight, Camera, Check, Images, Sparkles } from "lucide-react";
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

  const creditCost = numberOfGenerations * 2;

  return (
    <div className="pg-workspace studio-page min-w-0 flex-1">
      <div className="studio-wrap">
        <header className="studio-heading">
          <div><p className="studio-eyebrow">THE PRINTPETZ CREATIVE STUDIO</p><h1>Let’s tell <em>their story.</em></h1><p>A familiar face. A little imagination. Something entirely their own.</p></div>
          <Link href={ROUTES.history} className="studio-gallery-link"><Images size={17}/> Your gallery <ArrowUpRight size={16}/></Link>
        </header>

        <nav className="studio-progress" aria-label="Creation steps">
          <a href="#studio-pet"><span>{selectedModel ? <Check size={16}/> : "01"}</span><div>Your pet<small>{selectedModel ? "Selected" : "Start here"}</small></div></a>
          <a href="#studio-theme"><span>{selectedStyle ? <Check size={16}/> : "02"}</span><div>Their story<small>{selectedStyle ? selectedStyle.name : "Choose a theme"}</small></div></a>
          <a href="#studio-review"><span>03</span><div>The masterpiece<small>Review & create</small></div></a>
        </nav>

        <section id="studio-pet" className="studio-card">
          <div className="studio-section-heading"><div><p className="studio-eyebrow">01 / THE MAIN CHARACTER</p><h2>Who’s in the spotlight?</h2><p>Choose a saved pet or introduce someone new with 3 or more photos.</p></div><Camera className="studio-section-icon" size={25}/></div>
          <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel}/>
        </section>

        <section id="studio-theme" className="studio-card">
          <div className="studio-section-heading"><div><p className="studio-eyebrow">02 / A WORLD OF POSSIBILITIES</p><h2>Find their next adventure.</h2><p>Explore the collection. Choose the character that feels like them.</p></div>{selectedStyle && <span className="studio-selected-tag"><Check size={14}/>{selectedStyle.name}</span>}</div>
          <StyleSelector selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle}/>
        </section>

        <section id="studio-review" className="studio-card studio-review">
          <div className="studio-section-heading"><div><p className="studio-eyebrow">03 / THE FINISHING TOUCHES</p><h2>Make something worth keeping.</h2><p>Review your choices and credits before creating.</p></div></div>
          <div className="studio-review-grid">
            <div>
              <div className="studio-selection-pair">
                <div className="studio-selection"><div className="studio-selection-image">{selectedModel?.training_images?.[0] ? <CustomImagePreview image={selectedModel.training_images[0]} alt={selectedModel.name} className="object-cover"/> : <Camera size={28}/>}</div><div><small>YOUR PET</small><strong>{selectedModel?.name ?? "Choose your pet"}</strong><a href="#studio-pet">Change pet</a></div></div>
                <div className="studio-selection"><div className="studio-selection-image">{selectedStyle?.image ? <CustomImagePreview image={selectedStyle.image} alt={selectedStyle.name} className="object-cover"/> : <Sparkles size={28}/>}</div><div><small>THEIR THEME</small><strong>{selectedStyle?.name ?? "Choose a theme"}</strong><a href="#studio-theme">Change theme</a></div></div>
              </div>
              <GenerationControls numberOfGenerations={numberOfGenerations} setNumberOfGenerations={setNumberOfGenerations}/>
            </div>
            <div className="studio-create-panel">
              <p className="studio-eyebrow">YOUR NEXT CREATION</p>
              <div className="studio-cost"><span>{creditCost}</span><div>credits<small>{numberOfGenerations} image{numberOfGenerations > 1 ? "s" : ""} · 2 credits each</small></div></div>
              <div className="studio-balance"><span>Your balance</span><strong>{user.credits} credits</strong></div>
              {user.credits < creditCost && <p className="studio-low-credits">You’ll need more credits for this creation. <Link href={ROUTES.plan}>View plans</Link></p>}
              <Button onClick={handleGenerate} disabled={isGenerateButtonDisabled} loading={isSubmitting} className="studio-generate-button" aria-describedby="studio-generation-status">
                <Sparkles size={17}/>{isBatchGenerating ? "Creation in progress" : selectedModel && selectedStyle ? `Create ${numberOfGenerations} image${numberOfGenerations > 1 ? "s" : ""}` : "Choose your pet & theme"}
              </Button>
              <p id="studio-generation-status" role="status" className="studio-generation-note">{isSubmitting ? "Sending your creation request…" : isBatchGenerating ? "Your portraits are taking shape. Follow their progress in Gallery." : "Your new images will appear in Gallery, ready to review and refine."}</p>
              {isBatchGenerating && <Link href={ROUTES.history} className="studio-progress-link">View progress in Gallery <ArrowUpRight size={14}/></Link>}
            </div>
          </div>
        </section>
        <p className="studio-bottom-note">A little imagination. All their personality.</p>
      </div>
      <InsufficientCreditsDialog open={showCreditsDialog} onClose={() => setShowCreditsDialog(false)}/>
    </div>
  );
};
