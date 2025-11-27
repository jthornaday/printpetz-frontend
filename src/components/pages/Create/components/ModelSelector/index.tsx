import { CaretIcon, MagicSparkIcon, ModelIcon } from "@/components/icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ModelTrainingDialog } from "@/components/pages/shared/ModelTrainingDialog";
import { ModelSelectionPopover } from "./components/ModelSelectionPopover";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetModelsQuery } from "@/store/api/modelApi";
import { EModelStatus, IModel } from "@/types/model";
import { Loader } from "@/components/ui/loader";
import { useGetUserByIdQuery } from "@/store/api/userApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { getModelName } from "@/utils/app_utils";

type Props = {
  selectedModel: IModel | null;
  setSelectedModel: Dispatch<SetStateAction<IModel | null>>;
};

// Model Selector Component
export const ModelSelector = ({ selectedModel, setSelectedModel }: Props) => {
  const [openModelTrainingDialog, setOpenModelTrainingDialog] = useState(false);
  const [openModelSelectionPopover, setOpenModelSelectionPopover] = useState(false);

  const { data } = useGetUserByIdQuery();
  const { data: user } = data || {};

  const { data: models = [], isLoading } = useGetModelsQuery(
    user ? { user_id: user.id } : skipToken
  );

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
        {isLoading ? (
          <Loader size={18} />
        ) : !!models?.length ? (
          <Popover open={openModelSelectionPopover} onOpenChange={setOpenModelSelectionPopover}>
            <PopoverTrigger className="flex gap-2.5 items-center cursor-pointer">
              <div className="flex gap-2.5 items-center cursor-pointer text-black-40">
                <span className="font-semibold text-sm">
                  {selectedModel ? getModelName(selectedModel.name) : "· · ·"}
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
                models={models.filter((m) => m.status === EModelStatus.COMPLETED)}
                selectedModel={selectedModel}
                onSelection={(model) => {
                  setSelectedModel(model);
                  setOpenModelSelectionPopover(false);
                }}
                onCreateNew={() => {
                  setOpenModelSelectionPopover(false);
                  setOpenModelTrainingDialog(true);
                }}
              />
            </PopoverContent>
          </Popover>
        ) : (
          <p
            className="flex gap-2 items-center text-primary cursor-pointer"
            onClick={() => setOpenModelTrainingDialog(true)}
          >
            <MagicSparkIcon size={18} />
            <span className="font-semibold underline underline-offset-3 text-sm">
              Create New Model
            </span>
          </p>
        )}
      </div>

      {openModelTrainingDialog && (
        <ModelTrainingDialog onClose={() => setOpenModelTrainingDialog(false)} />
      )}
    </div>
  );
};
