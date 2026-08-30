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
    defaultValues: { petName: "", name: "", images: [] },
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

    if (user.credits < appConstants.modelTrainingCredit) {
      setShowCreditsDialog(true);
      return;
    }

    try {
      const imageUrls = await uploadImages(selectedImages);

      await trainModel({
        name: formData.name.trim(),
        petName: formData.petName.trim(),
        images: imageUrls,
      }).unwrap();

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
    <div className="order-1 min-h-0 min-w-0 flex-1 overflow-y-auto p-4 md:order-2 md:h-full">
      <FormProvider {...methods}>
        <div className="flex min-h-full flex-col gap-5 pb-2">
          <div className="flex flex-col gap-4">
            <div>
              <ControlledInput
                name="petName"
                label="Your pet's name"
                placeholder="Max"
                className="text-sm"
              />
              <p className="mt-1.5 text-xs text-black-40">
                This is your pet&apos;s real name. It may appear on jerseys, uniforms, badges, trunks, and other personalized artwork.
              </p>
            </div>
            <div>
              <ControlledInput
                name="name"
                label="Name this pet model"
                placeholder="Max Baseball"
                className="text-sm"
              />
              <p className="mt-1.5 text-xs text-black-40">
                This is only for organizing your saved models. It will not appear in the artwork.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold">Upload Your Pet&apos;s Images</p>
              <p className="mt-1.5 text-xs text-black-40">
                Upload at least 3 clear photos. For the closest likeness, we recommend 6-10 photos
                from different angles.
              </p>
            </div>
            <div className="flex w-full justify-center">
              {!!selectedImages.length ? (
                <div className="grid h-fit w-full grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                  {selectedImages.map((file, index) => {
                    return (
                      <div key={index} className="h-fit">
                        <div className="group relative aspect-[4/5] w-full overflow-clip rounded-lg bg-black-80">
                          <div
                            onClick={() =>
                              setSelectedImages((pre) => pre.filter((_, i) => i !== index))
                            }
                            className="absolute -right-0.5 -top-0.5 z-10 cursor-pointer rounded-full border-2 border-black-90 bg-black-50 p-1 opacity-0 transition-all group-hover:opacity-100"
                          >
                            <CancelIcon size={12} className="[&>*]:stroke-[3]" />
                          </div>
                          <CustomImagePreview image={file.src} />
                        </div>
                      </div>
                    );
                  })}
                  {selectedImages.length < max && (
                    <div className="aspect-[4/5] w-full rounded-lg border-2 border-dashed border-black-60">
                      <InputMultipleImages isSmall setSelectedImages={setSelectedImages} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-40 w-full overflow-hidden rounded-2xl border-2 border-dashed border-black-60">
                  <InputMultipleImages setSelectedImages={setSelectedImages} />
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto pt-2">
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
            <div className="mt-4 flex items-center justify-center pb-2">
              <div className="flex items-center gap-2 rounded-2xl border border-yellow/10 bg-yellow/5 px-4 py-2 transition-all hover:bg-yellow/10">
                <CreditIcon size={18} className="text-yellow" />
                <p className="text-sm font-medium text-black-40">
                  Model training will charge{" "}
                  <span className="font-bold text-[#171524]">
                    {appConstants.modelTrainingCredit} credits
                  </span>{" "}
                  from your account.
                </p>
              </div>
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
