import { ErrorIcon, MagicSparkIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { EModelStatus, IModel } from "@/types/model";
import { getModelName } from "@/utils/app_utils";

type Props = {
  models: IModel[];
  selectedModel: IModel | null;
  onSelection: (model: IModel) => void;
  onCreateNew: () => void;
};

export const ModelSelectionPopover = ({
  onCreateNew,
  onSelection,
  selectedModel,
  models,
}: Props) => {
  return (
    <div className="flex flex-col">
      {models.map((model) => {
        const isSelected = model.id === selectedModel?.id;
        const isModelTraining = [EModelStatus.PENDING, EModelStatus.TRAINING].includes(
          model.status
        );
        const isCompleted = model.status === EModelStatus.COMPLETED;
        const isError = model.status === EModelStatus.ERROR;

        return (
          <div
            key={model.id}
            onClick={() => isCompleted && onSelection(model)}
            className={cn(
              "w-full p-3.5 transition text-sm flex items-center justify-between rounded-lg cursor-pointer",
              {
                "bg-black-80": isSelected,
                "hover:bg-black-80/80": !isError && !isSelected,
              }
            )}
          >
            <div className="flex items-center gap-2">
              {isModelTraining && <Loader size={16} />}
              <span className={`${isSelected ? "text-primary font-semibold" : "text-black-40"}`}>
                {getModelName(model.name)}
              </span>
            </div>
            {isSelected && <span className="text-primary">✓</span>}
            {isError && <ErrorIcon size={18} className="text-red" />}
          </div>
        );
      })}
      <Button onClick={onCreateNew} className="px-5 mt-2">
        <MagicSparkIcon />
        Create New Model
      </Button>
    </div>
  );
};
