import { CaretIcon, MagicSparkIcon, ModelIcon } from "@/components/icons";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ModelSelectionPopover } from "./components/ModelSelectionPopover";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EModelStatus, IModel } from "@/types/model";
import { Loader } from "@/components/ui/loader";
import { useGetUser } from "@/hooks/user/useGetUser";
import { getModelName } from "@/utils/app_utils";
import { useGetModels } from "@/hooks/model/useGetModels";
import { setAppContext } from "@/store/slices/appContextSlice";
import { useAppDispatch } from "@/store";

type Props = {
  selectedModel: IModel | null;
  setSelectedModel: Dispatch<SetStateAction<IModel | null>>;
};

// Model Selector Component
export const ModelSelector = ({ selectedModel, setSelectedModel }: Props) => {
  const dispatch = useAppDispatch();

  const [openModelSelectionPopover, setOpenModelSelectionPopover] = useState(false);
  const knownCompletedModelIds = useRef<Set<number>>(new Set());
  const hasInitializedCompletedModels = useRef(false);

  const { user } = useGetUser();

  const { models, isModelsFetching } = useGetModels(user?.id);

  const openModelTraining = () => {
    setOpenModelSelectionPopover(false);
    dispatch(setAppContext({ isModelTrainingDialogOpen: true }));
  };

  useEffect(() => {
    const completeModels = models.filter((m) => m.status === EModelStatus.COMPLETED);
    const completeModelIds = new Set(completeModels.map((model) => model.id));

    // On first load, keep the existing behavior: select the first completed model
    // only when the user has not already selected one.
    if (!hasInitializedCompletedModels.current) {
      knownCompletedModelIds.current = completeModelIds;
      hasInitializedCompletedModels.current = true;

      if (!selectedModel && completeModels[0]) {
        setSelectedModel(completeModels[0]);
      }
      return;
    }

    // When a model finishes training while the Create page is open, automatically
    // switch to that newly completed model. This keeps the currently selected style
    // paired with the model the user just trained.
    const newlyCompletedModels = completeModels.filter(
      (model) => !knownCompletedModelIds.current.has(model.id)
    );

    if (newlyCompletedModels.length) {
      const newestCompletedModel = newlyCompletedModels.reduce((newest, model) =>
        model.id > newest.id ? model : newest
      );
      setSelectedModel(newestCompletedModel);
    } else if (!selectedModel && completeModels[0]) {
      setSelectedModel(completeModels[0]);
    }

    knownCompletedModelIds.current = completeModelIds;
  }, [models, selectedModel, setSelectedModel]);

  return (
    <div className="relative flex flex-col gap-3">
      <div className="w-full rounded-lg bg-black-90 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <ModelIcon size={20} />
            <span className="font-bold">Model</span>
          </div>

          {isModelsFetching ? (
            <Loader size={18} />
          ) : !!models?.length ? (
            <Popover open={openModelSelectionPopover} onOpenChange={setOpenModelSelectionPopover}>
              <PopoverTrigger className="flex cursor-pointer items-center gap-2.5">
                <div className="flex cursor-pointer items-center gap-2.5 text-black-40">
                  <span className="text-sm font-semibold">
                    {selectedModel ? getModelName(selectedModel.name) : "Select Model"}
                  </span>
                  <CaretIcon size={14} className="rotate-90" />
                </div>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                side="right"
                sideOffset={45}
                className="-mt-5 h-fit rounded-xl border-none bg-black-90 p-2"
              >
                <ModelSelectionPopover
                  models={models}
                  selectedModel={selectedModel}
                  onSelection={(model) => {
                    setSelectedModel(model);
                    setOpenModelSelectionPopover(false);
                  }}
                  onCreateNew={openModelTraining}
                />
              </PopoverContent>
            </Popover>
          ) : null}
        </div>

        {!isModelsFetching && (
          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/15"
            onClick={openModelTraining}
          >
            <MagicSparkIcon size={18} />
            Create My Model
          </button>
        )}
      </div>

      {selectedModel?.training_images?.length ? (
        <div className="rounded-xl border border-[#e7e2ee] bg-white p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[#171524]">{getModelName(selectedModel.name)}</p>
              <p className="text-xs text-black-40">Photos used to train this pet model</p>
            </div>
            <span className="text-xs font-semibold text-black-40">
              {selectedModel.training_images.length} photos
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {selectedModel.training_images.map((image, index) => (
              <div
                key={`${selectedModel.id}-${index}`}
                className="aspect-[4/5] overflow-hidden rounded-lg bg-black-80"
              >
                <img
                  src={image}
                  alt={`${getModelName(selectedModel.name)} training photo ${index + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
