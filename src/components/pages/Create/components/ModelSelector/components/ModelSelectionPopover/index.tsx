import { MagicSparkIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { IModel } from "@/types/model";
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
        return (
          <div
            key={model.id}
            onClick={() => onSelection(model)}
            className={`w-full p-3.5 transition text-sm flex items-center justify-between rounded-lg cursor-pointer ${
              isSelected ? "bg-black-80" : "hover:bg-black-80/80"
            }`}
          >
            <span className={`${isSelected ? "text-white" : "text-black-40"}`}>
              {getModelName(model.name)}
            </span>
            {isSelected && <span className="text-white">✓</span>}
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
