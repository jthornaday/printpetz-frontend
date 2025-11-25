import { DeleteIcon, MagicSparkIcon, ModelIcon } from "@/components/icons";
import { ModelTrainingDialog } from "@/components/pages/shared/ModelTrainingDialog";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmationDialog";
import { useAppSelector } from "@/store";
import { useGetModelsQuery, useUpdateModelMutation } from "@/store/api/modelApi";
import { EModelStatus } from "@/types/model";
import { useState } from "react";

export const ModelSection = () => {
  const { user } = useAppSelector((state) => state.auth);

  const { data: models = [] } = useGetModelsQuery({ user_id: user?.id || "" });
  const [updateModel, { isLoading: isDeleting }] = useUpdateModelMutation();
  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false);

  const handleDeleteModel = async (id: number) => {
    try {
      await updateModel({ id, is_deleted: true }).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to delete model:", error);
      return false;
    }
  };

  return (
    <section className="bg-black-90 rounded-lg p-4">
      <div className="flex flex-col gap-6">
        {/* Title */}
        <div className="flex items-center gap-4 font-bold">
          <ModelIcon size={20} />
          <span>Model</span>
        </div>

        <div className="flex flex-col gap-1">
          {models.map((model, i) => {
            const isTraining = model.status === EModelStatus.TRAINING;
            return (
              <div
                key={model.id}
                className="flex gap-4 items-center p-1.5 rounded-lg hover:bg-black-80"
              >
                <div className="relative w-10 bg-black-100 aspect-square rounded-sm overflow-hidden">
                  <CustomImagePreview
                    image={
                      model.training_images?.[0] ||
                      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?q=80"
                    }
                    className={isTraining ? "opacity-50" : ""}
                  />
                </div>
                <p className={`text-sm font-semibold flex-1 ${isTraining ? "text-white/30" : ""}`}>
                  {model.name}
                </p>
                {isTraining ? (
                  <div className="flex items-center gap-2 text-primary">
                    <MagicSparkIcon size={18} />
                    <span className="text-sm font-bold">Training In Progress...</span>
                  </div>
                ) : (
                  <ConfirmationDialog
                    title="Delete Your Pet`s Model"
                    description={`This will permanently delete ${model.name}. You'll need to upload photos and retrain to generate images again. Are you absolutely sure?`}
                    confirmText="Yes, Delete It"
                    cancelText="Keep It"
                    isLoading={isDeleting}
                    onConfirm={() => handleDeleteModel(model.id)}
                    trigger={<DeleteIcon className="text-red cursor-pointer" />}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Button */}
        <Button onClick={() => setIsTrainingDialogOpen(true)}>
          <MagicSparkIcon size={20} /> Create New Model
        </Button>
      </div>

      {isTrainingDialogOpen && (
        <ModelTrainingDialog onClose={() => setIsTrainingDialogOpen(false)} />
      )}
    </section>
  );
};
