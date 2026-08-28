import { CancelIcon, DownloadIcon, ShareIcon } from "@/components/icons";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import AutoSmartMockup from "../AutoSmartMokup";
import { ImageEditorPanel } from "../ImageEditorPanel";
import { IGenerationViewItem } from "@/types/generation";
import mugMockup from "@/utils/images/mockups/mug.png";
import pillowMockup from "@/utils/images/mockups/pillow.png";
import tShirtMockup from "@/utils/images/mockups/t-shirt.png";
import { handleDownloadImage } from "@/services/shared/image";
import { useState } from "react";

type Props = {
  generation: IGenerationViewItem;
  chips: string[];
  onClose: () => void;
};

const mockupConfigs = [
  { mockup: mugMockup, width: 51, left: 30, top: 21 },
  { mockup: pillowMockup, width: 72, left: 14, top: 21 },
  { mockup: tShirtMockup, width: 53, left: 21, top: 25 },
];

export const GenerationPreviewDialog = ({ generation, chips, onClose }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleShare = async () => {
    if (!generation.image) return;

    try {
      const response = await fetch(generation.image, { cache: "no-store" });
      const blob = await response.blob();

      const getFileExtension = () => {
        if (blob.type) {
          const mimeToExt: Record<string, string> = {
            "image/png": "png",
            "image/jpeg": "jpg",
            "image/jpg": "jpg",
            "image/webp": "webp",
            "image/gif": "gif",
          };
          return mimeToExt[blob.type] || "png";
        }

        const urlParts = generation.image!.split("?")[0].split(".");
        return urlParts[urlParts.length - 1] || "png";
      };

      const extension = getFileExtension();
      const filename = `printpetz_${Date.now()}.${extension}`;
      const file = new File([blob], filename, { type: blob.type || "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Check out my PrintPetz creation!",
          text: "Generated image from PrintPetz",
        });
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(generation.image);
        alert("Image URL copied to clipboard!");
      } else {
        alert("Sharing is not supported on this device. Please use the download button.");
      }
    } catch (error) {
      console.error("Error sharing image:", error);
      alert("Failed to share image. Please try downloading instead.");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-h-[92dvh] w-[calc(100%_-_1.5rem)] min-w-0 overflow-y-auto rounded-xl border-none bg-black-90 p-4 sm:p-5",
          isEditing ? "max-w-5xl" : "max-w-xl sm:w-14/16",
        )}
      >
        <DialogHeader className="flex-row items-start justify-between">
          <DialogTitle className="flex min-w-0 flex-wrap gap-2 sm:gap-3">
            {chips.map((item, i) => (
              <div key={i} className="rounded-lg bg-black-80 px-4 py-2 text-sm">
                {item}
              </div>
            ))}
          </DialogTitle>
          <DialogClose onClick={onClose} className="cursor-pointer text-black-40">
            <CancelIcon size={22} />
          </DialogClose>
        </DialogHeader>

        {isEditing && generation.image ? (
          <ImageEditorPanel image={generation.image} onBack={() => setIsEditing(false)} />
        ) : (
          <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:gap-5">
            <div className="flex flex-1 flex-col gap-2">
              <div className="relative aspect-[4/5] w-full flex-1 overflow-hidden rounded-lg bg-black-100">
                {generation.image && <CustomImagePreview image={generation.image} />}
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Button
                  variant="secondary"
                  className="aspect-square w-fit px-2"
                  onClick={handleShare}
                >
                  <ShareIcon size={22} />
                </Button>
                <Button
                  variant="secondary"
                  className="min-w-[110px] flex-1"
                  onClick={() => setIsEditing(true)}
                  disabled={!generation.image}
                >
                  Edit image
                </Button>
                <Button className="min-w-[120px] flex-1" onClick={() => handleDownloadImage(generation.image)}>
                  <DownloadIcon size={22} />
                  Download
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:flex sm:w-[110px] sm:flex-col sm:gap-3">
              {[null, ...mockupConfigs].map((mockupConfig, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/5] flex-1 overflow-hidden rounded-md bg-black-100"
                >
                  {generation.image && (
                    <AutoSmartMockup mockupConfig={mockupConfig} design={generation.image} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
