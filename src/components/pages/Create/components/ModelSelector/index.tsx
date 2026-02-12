import { CaretIcon, MagicSparkIcon, ModelIcon } from "@/components/icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

  const { user } = useGetUser();

  const { models, isModelsFetching } = useGetModels(user?.id);

  useEffect(() => {
    const completeModels = models.filter((m) => m.status === EModelStatus.COMPLETED);

    if (!selectedModel && completeModels[0]) {
      setSelectedModel(completeModels[0]);
    }
  }, [models]);

  return (
    <div className="relative">
      <div className="w-full bg-black-90 p-4 rounded-lg flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <ModelIcon size={20} />
          <span className="font-bold">Model</span>
        </div>
        {isModelsFetching ? (
          <Loader size={18} />
        ) : !!models?.length ? (
          <Popover open={openModelSelectionPopover} onOpenChange={setOpenModelSelectionPopover}>
            <PopoverTrigger className="flex gap-2.5 items-center cursor-pointer">
              <div className="flex gap-2.5 items-center cursor-pointer text-black-40">
                <span className="font-semibold text-sm">
                  {selectedModel ? getModelName(selectedModel.name) : "Select Model"}
                </span>
                <CaretIcon size={14} className="rotate-90" />
              </div>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              side="right"
              sideOffset={45}
              className="rounded-xl bg-black-90 border-none h-fit -mt-5 p-2"
            >
              <ModelSelectionPopover
                models={models.filter((m) => m.status !== EModelStatus.ERROR)}
                selectedModel={selectedModel}
                onSelection={(model) => {
                  setSelectedModel(model);
                  setOpenModelSelectionPopover(false);
                }}
                onCreateNew={() => {
                  setOpenModelSelectionPopover(false);
                  dispatch(setAppContext({ isModelTrainingDialogOpen: true }));
                }}
              />
            </PopoverContent>
          </Popover>
        ) : (
          <p
            className="flex gap-2 items-center text-primary cursor-pointer"
            onClick={() => dispatch(setAppContext({ isModelTrainingDialogOpen: true }))}
          >
            <MagicSparkIcon size={18} />
            <span className="font-semibold underline underline-offset-3 text-sm">
              Create New Model
            </span>
          </p>
        )}
      </div>
    </div>
  );
};
