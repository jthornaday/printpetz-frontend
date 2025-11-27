import { MagicSparkIcon, ModelIcon } from "@/components/icons";
import { ModelTrainingDialog } from "@/components/pages/shared/ModelTrainingDialog";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useGetModelsQuery } from "@/store/api/modelApi";
import { useState } from "react";
import { ModelItem } from "./components/ModelItem";
import { useGetUserByIdQuery } from "@/store/api/userApi";
import { skipToken } from "@reduxjs/toolkit/query";

export const ModelSection = () => {
  const { data } = useGetUserByIdQuery();
  const { data: user } = data || {};

  const { data: models = [], isLoading } = useGetModelsQuery(
    user ? { user_id: user.id } : skipToken
  );
  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false);

  return (
    <section className="bg-black-90 rounded-lg p-4">
      <div className="h-full flex flex-col gap-6">
        {/* Title */}
        <div className="flex items-center gap-4 font-bold">
          <ModelIcon size={20} />
          <span>Model</span>
        </div>

        <div className="flex flex-col gap-1 items-center">
          {isLoading ? (
            <Loader size={18} />
          ) : !!models.length ? (
            models.map((model) => <ModelItem key={model.id} model={model} />)
          ) : (
            <p className="text-sm text-center text-black-40">No models found</p>
          )}
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
