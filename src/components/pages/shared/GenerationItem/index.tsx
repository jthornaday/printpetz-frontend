import { DownloadIcon, LoadingIcon, ThunderIcon } from "@/components/icons";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { Button } from "@/components/ui/button";
import { EGenerationStatus, IGenerationViewItem } from "@/types/generation";
import { useState } from "react";

type Props = {
  generation: IGenerationViewItem;
  onClick: () => void;
};

export const GenerationItem = ({ generation, onClick }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownloadImage = async () => {
    if (!generation.image) return;
    const response = await fetch(generation.image);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "printpetz_" + Date.now() + generation.image.split(".")[1];
    link.click();

    URL.revokeObjectURL(link.href);
  };

  return (
    <div
      className="relative aspect-[4/5] rounded-md overflow-hidden bg-gray-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => generation.image && onClick()}
    >
      {generation.status === EGenerationStatus.GENERATING && (
        <div className="w-full h-full flex items-center justify-center">
          <LoadingIcon className="animate-spin text-primary" size={32} />
        </div>
      )}

      {generation.status === EGenerationStatus.ERROR && (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
          <ThunderIcon className="text-red-500 mb-2" size={32} />
          <p className="text-xs text-red-400 line-clamp-3">
            {generation.error || "Generation failed"}
          </p>
        </div>
      )}

      {generation.status === EGenerationStatus.COMPLETED && generation.image && (
        <CustomImagePreview image={generation.image} />
      )}

      {isHovered &&
        generation.status === EGenerationStatus.COMPLETED &&
        generation.image && (
          <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDownloadImage();
              }}
              variant={"link"}
              className="p-1.5 min-h-fit h-fit backdrop-blur-sm bg-black-100/70 hover:bg-black-100/80 text-white"
            >
              <DownloadIcon size={22} />
            </Button>
          </div>
        )}
    </div>
  );
};
