import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { ConfirmationDialog } from "@/components/ui/confirmationDialog";
import { DeleteIcon } from "@/components/icons";
import { EModelStatus, IModel } from "@/types/model";
import { useUpdateModelMutation } from "@/store/api/modelApi";
import { getModelName } from "@/utils/app_utils";
import { Loader } from "@/components/ui/loader";
import { ErrorIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export const ModelItem = ({ model }: { model: IModel }) => {
  const [updateModel, { isLoading: isDeleting }] = useUpdateModelMutation();

  const handleDeleteModel = async (id: number) => {
    try {
      await updateModel({ id, is_deleted: true }).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to delete model:", error);
      return false;
    }
  };

  const isError = model.status === EModelStatus.ERROR;
  const isTraining = model.status === EModelStatus.TRAINING;

  return (
    <div className="w-full flex gap-4 items-center p-1.5 rounded-lg hover:bg-black-80">
      <div className="relative w-10 bg-black-100 aspect-square rounded-sm overflow-hidden">
        {isError ? (
          <ErrorIcon
            size={24}
            className="text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        ) : (
          model.training_images?.[0] && <CustomImagePreview image={model.training_images[0]} />
        )}
      </div>
      <p
        className={cn("text-sm font-semibold flex-1", {
          "text-black-50": isTraining,
          "text-black-40": isError,
        })}
      >
        {getModelName(model.name)}
      </p>
      {isTraining ? (
        <div className="flex items-center gap-2 text-primary">
          <Loader size={18} />
          <span className="text-sm font-bold">Training....</span>
        </div>
      ) : (
        <ConfirmationDialog
          title="Delete Your Pet`s Model"
          description={`This will permanently delete ${getModelName(
            model.name
          )}. You'll need to upload photos and retrain to generate images again. Are you absolutely sure?`}
          confirmText="Yes, Delete It"
          cancelText="Keep It"
          isLoading={isDeleting}
          onConfirm={() => handleDeleteModel(model.id)}
          trigger={<DeleteIcon className="text-red cursor-pointer" />}
        />
      )}
    </div>
  );
};
