import { handleGetImageMetadata } from "@/services/shared/image";
import { ImageMetadata } from "@/types/common";
import { useRef } from "react";

type Props = {
  setImage: (metadata: ImageMetadata) => void;
};

export const InputSingleImage = ({
  setImage,
  children,
}: React.ComponentProps<"button"> & Props) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const currentSelections = await handleGetImageMetadata(Array.from(files));
    setImage(currentSelections[0]);
  };

  const openFilePicker = () => {
    imageInputRef.current?.click();
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        className="hidden"
        ref={imageInputRef}
        onChange={(e) => void handleFiles(e.target.files)}
        onClick={(e) => ((e.target as HTMLInputElement).value = "")}
      />

      <div onClick={openFilePicker} className="cursor-pointer w-full h-full">
        {children}
      </div>
    </div>
  );
};
