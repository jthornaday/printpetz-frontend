import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/ui/form/ControlledInput";
import { FormProvider, useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useState } from "react";
import { ImageMetadata } from "@/types/common";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { appConstants } from "@/utils/constants/appConstants";
import { CancelIcon, CreditIcon } from "@/components/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { modelTrainingSchema } from "@/lib/validations/modelTraining";
import { IModelTrainingRequest } from "@/types/modelTraining";
import { InputMultipleImages } from "@/components/pages/shared/InputMultipleImages";
import { useUploadFileMutation } from "@/store/api/fileApi";
import { useTrainModelMutation } from "@/store/api/modelApi";
import { EUploadFile } from "@/types/file";
import { dataURLtoFile } from "@/services/shared/image";
import { useGetUser } from "@/hooks/user/useGetUser";
import { useToast } from "@/hooks/useToast";
import { EToastType } from "@/types/toast";
import { ApiError } from "@/types/api";
import { InsufficientCreditsDialog } from "@/components/shared/InsufficientCreditsDialog";

const { min, max } = appConstants.modelTraining.imageSelectionLimit;

type Props = { setIsRequestSubmitted: Dispatch<SetStateAction<boolean>> };

export const ModelTrainingForm = ({ setIsRequestSubmitted }: Props) => {
  const { toast } = useToast();
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);

  const { user } = useGetUser();

  const [selectedImages, setSelectedImages] = useState<ImageMetadata[]>([]);

  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [trainModel, { isLoading: isTraining }] = useTrainModelMutation();

  const methods = useForm<IModelTrainingRequest>({
    defaultValues: { name: "", images: [] },
    resolver: yupResolver(modelTrainingSchema),
  });
  const { handleSubmit } = methods;

  const uploadImages = async (images: ImageMetadata[]) => {
    const files = images.map((img) => dataURLtoFile(img.src, img.name));

    const BATCH_SIZE = 2;
    const batches: File[][] = [];
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      batches.push(files.slice(i, i + BATCH_SIZE));
    }

    const results = await Promise.all(
      batches.map((batch) =>
        uploadFile({ files: batch, type: EUploadFile.TRAINING_IMAGE }).unwrap()
      )
    );

    return results.flatMap((result) => result.data?.fileUrls ?? []);
  };

  const onSubmit = handleSubmit(async (formData) => {
    if (!user) return;

    // check if user has enough credits (If we do not check here then all images will upload and then backend give us 403 error for insufficient credits)
    if (user.credits < appConstants.modelTrainingCredit) {
      setShowCreditsDialog(true);
      return;
    }

    try {
      const imageUrls = await uploadImages(selectedImages);

      await trainModel({ name: formData.name, images: imageUrls }).unwrap();

      setIsRequestSubmitted(true);
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError?.status === 403) {
        setShowCreditsDialog(true);
        return;
      }

      const message = apiError?.data?.message || "Failed to train model";
      toast(EToastType.ERROR, message);
    }
  });

  const isModelTraining = isUploading || isTraining;

  return (
    <div className="order-1 flex min-w-0 flex-col gap-3 p-4 md:order-2 md:flex-1">
      <FormProvider {...methods}>
        <div className="flex-1 flex flex-col gap-5 overflow-auto">
          <ControlledInput
            name="name"
            label="What would you like to call this model?"
            placeholder="Enter Model name (Ex. Ketty, Max)"
            className="text-sm"
          />
          <div className="overflow-auto flex-1 flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold">Upload Your Pet`s Images</p>
              <p className="text-xs text-black-40 mt-1.5">
                Upload at least 3 clear photos. For the closest likeness, we recommend 6-10 photos
                from different angles.
              </p>
            </div>
            <div className="w-full h-full flex-1 flex justify-center overflow-auto">
              {!!selectedImages.length ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 w-full h-fit gap-2">
                  {selectedImages.map((file, index) => {
                    return (
                      <div key={index} className="h-fit">
                        <div
                          className={`relative group w-full aspect-[4/5] overflow-clip rounded-lg bg-black-80`}
                        >
                          <div
                            onClick={() =>
                              setSelectedImages((pre) => pre.filter((_, i) => i !== index))
                            }
                            className="bg-black-50 border-2 border-black-90 group-hover:opacity-100 absolute z-10 -top-0.5 -right-0.5 rounded-full opacity-0 p-1 transition-all cursor-pointer"
                          >
                            <CancelIcon size={12} className="[&>*]:stroke-[3]" />
                          </div>
                          <CustomImagePreview image={file.src} />
                        </div>
                      </div>
                    );
                  })}
                  {selectedImages.length < max && (
                    <div
                      className={`w-full aspect-[4/5] border-2 border-dashed border-black-60 rounded-lg`}
                    >
                      <InputMultipleImages isSmall setSelectedImages={setSelectedImages} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full rounded-2xl border-2 h-40 border-dashed border-black-60 overflow-hidden">
                  <InputMultipleImages setSelectedImages={setSelectedImages} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          {!!selectedImages.length && (
            <p
              className={`text-center text-sm ${
                selectedImages.length < min ? "text-red" : "text-black-40"
              }`}
            >
              {selectedImages.length < min
                ? `Please upload at least ${min} images to continue.`
                : `Ready to continue. More clear angles can improve your pet's likeness (up to ${max}).`}
            </p>
          )}
          <Button
            onClick={onSubmit}
            disabled={selectedImages.length < min || isModelTraining}
            className="mt-2"
          >
            {isModelTraining ? "Training Model..." : "Train Model"}
          </Button>
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow/5 border border-yellow/10 rounded-2xl transition-all hover:bg-yellow/10">
              <CreditIcon size={18} className="text-yellow" />
              <p className="text-sm font-medium text-black-40">
                Model training will charge{" "}
                <span className="text-[#171524] font-bold">
                  {appConstants.modelTrainingCredit} credits
                </span>{" "}
                from your account.
              </p>
            </div>
          </div>
        </div>
      </FormProvider>

      <InsufficientCreditsDialog
        open={showCreditsDialog}
        onClose={() => setShowCreditsDialog(false)}
      />
    </div>
  );
};
