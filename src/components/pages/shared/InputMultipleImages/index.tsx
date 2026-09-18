import { UploadImageIcon } from "@/components/icons";
import { handleGetImageMetadata, isHeicFile } from "@/services/shared/image";
import { ImageMetadata } from "@/types/common";
import { useToast } from "@/hooks/useToast";
import { EToastType } from "@/types/toast";
import { appConstants } from "@/utils/constants/appConstants";
import { Dispatch, SetStateAction, useRef } from "react";

const { max } = appConstants.modelTraining.imageSelectionLimit;

type Props = {
  setSelectedImages: Dispatch<SetStateAction<ImageMetadata[]>>;
  isSmall?: boolean;
};

export const InputMultipleImages = ({ setSelectedImages, isSmall = false }: Props) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const all = Array.from(files);
    const heicFlags = await Promise.all(all.map(isHeicFile));
    const heicNames = all.filter((_, i) => heicFlags[i]).map((f) => f.name);
    if (heicNames.length) {
      toast(
        EToastType.ERROR,
        `${heicNames.join(", ")} ${heicNames.length > 1 ? "are" : "is"} in Apple's HEIC format, ` +
          "which we can't read. Please use a JPEG or PNG instead (iPhone: Settings > Camera > " +
          "Formats > Most Compatible)."
      );
    }

    const currentSelections = await handleGetImageMetadata(all.filter((_, i) => !heicFlags[i]));
    setSelectedImages((prev) => {
      const availableSlots = max - prev.length;
      if (availableSlots <= 0) return prev;
      const imagesToAdd = currentSelections.slice(0, availableSlots);
      return prev.concat(imagesToAdd);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const openFilePicker = () => {
    imageInputRef.current?.click();
  };

  return (
    <div className="w-full h-full  flex justify-center  items-center relative">
      <input
        multiple
        type="file"
        accept=".jpg, .jpeg, .png"
        className="hidden "
        ref={imageInputRef}
        onChange={(e) => void handleFiles(e.target.files)}
        onClick={(e) => ((e.target as HTMLInputElement).value = "")}
      />

      <div
        onClick={openFilePicker}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="absolute flex flex-col items-center justify-center cursor-pointer w-full h-full gap-5 text-black-50"
      >
        <UploadImageIcon size={26} />
        {!isSmall && (
          <div className="text-center text-sm font-bold">Drag & Drop Files or Upload</div>
        )}
      </div>
    </div>
  );
};
