import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/ui/form/ControlledInput";
import { FormProvider, useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useState } from "react";
import { ImageMetadata } from "@/types/common";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { appConstants } from "@/utils/constants/appConstants";
import { CancelIcon } from "@/components/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { modelTrainingSchema } from "@/lib/validations/modelTraining";
import { IModelTrainingRequest } from "@/types/modelTraining";
import { InputMultipleImages } from "@/components/pages/shared/InputMultipleImages";
import { useUploadFileMutation } from "@/store/api/fileApi";
import { useTrainModelMutation } from "@/store/api/modelApi";
import { EUploadFile } from "@/types/file";
import { dataURLtoFile } from "@/services/shared/image";

const { min, max } = appConstants.modelTraining.imageSelectionLimit;

type Props = { setIsRequestSubmitted: Dispatch<SetStateAction<boolean>> };

export const ModelTrainingForm = ({ setIsRequestSubmitted }: Props) => {
  const [selectedImages, setSelectedImages] = useState<ImageMetadata[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [uploadFile] = useUploadFileMutation();
  const [trainModel] = useTrainModelMutation();

  const methods = useForm<IModelTrainingRequest>({
    defaultValues: { name: "", images: [] },
    resolver: yupResolver(modelTrainingSchema),
  });
  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    try {
      setIsUploading(true);

      // Convert ImageMetadata to File objects
      const files = selectedImages.map((img) => dataURLtoFile(img.src, img.name));

      // Upload files in batches of 5 in parallel
      const batchSize = 5;
      const batches: File[][] = [];
      
      for (let i = 0; i < files.length; i += batchSize) {
        batches.push(files.slice(i, i + batchSize));
      }

      // Upload all batches in parallel
      const uploadPromises = batches.map((batch) =>
        uploadFile({
          files: batch,
          type: EUploadFile.TRAINING_IMAGE,
        }).unwrap()
      );

      const results = await Promise.all(uploadPromises);

      // Collect all uploaded URLs
      const uploadedUrls: string[] = [];
      results.forEach((result) => {
        if (result.data) {
          uploadedUrls.push(...result.data.fileUrls);
        }
      });

      // Train the model with uploaded image URLs
      await trainModel({
        name: formData.name,
        images: uploadedUrls,
      }).unwrap();

      setIsRequestSubmitted(true);
    } catch (error) {
      console.error("Failed to train model:", error);
      // You might want to show an error toast here
    } finally {
      setIsUploading(false);
    }
  });

  return (
    <div className="flex flex-col gap-3 flex-1 p-4">
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
                Please Upload 15-30 Images, We will be used it to generate model.
              </p>
            </div>
            <div className="w-full h-full flex-1 flex justify-center overflow-auto">
              {!!selectedImages.length ? (
                <div className="grid grid-cols-7 w-full h-fit gap-2">
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
                <div className="w-full rounded-2xl border-2 h-40 m-2 border-dashed border-black-60 overflow-hidden">
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
                selectedImages.length < 15 ? "text-red" : "text-black-40"
              }`}
            >
              {selectedImages.length < 15
                ? "Please upload at least 15 images to train accurate Model."
                : "You can upload up to 30 images to train accurate Model."}
            </p>
          )}
          <Button onClick={onSubmit} disabled={selectedImages.length < min || isUploading} className="mt-2">
            {isUploading ? "Training Model..." : "Train Model"}
          </Button>
        </div>
      </FormProvider>
    </div>
  );
};
