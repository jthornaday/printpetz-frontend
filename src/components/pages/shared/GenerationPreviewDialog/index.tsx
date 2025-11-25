import { CancelIcon, DownloadIcon, PrinterIcon, ShareIcon } from "@/components/icons";
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
import { IGenerationViewItem } from "@/types/generation";
import mugMockup from "@/utils/images/mockups/mug.png";
import pillowMockup from "@/utils/images/mockups/pillow.png";
import tShirtMockup from "@/utils/images/mockups/t-shirt.png";
import { handleDownloadImage } from "@/services/shared/image";

type Props = {
  generation: IGenerationViewItem;
  chips: string[];
  onClose: () => void;
};

const mockupConfigs = [
  {
    mockup: mugMockup,
    width: 60,
    left: 35,
    top: 32,
  },
  {
    mockup: pillowMockup,
    width: 84,
    left: 16,
    top: 32,
  },
  {
    mockup: tShirtMockup,
    width: 62,
    left: 24,
    top: 38,
  },
];

export const GenerationPreviewDialog = ({ generation, chips, onClose }: Props) => {
  const handleShare = async () => {
    if (!generation.image) return;

    try {
      // Fetch image as blob
      const response = await fetch(generation.image, { cache: "no-store" });
      const blob = await response.blob();

      // Get file extension from blob type or URL
      const getFileExtension = () => {
        // Try to get from MIME type
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

        // Fallback: try to extract from URL
        const urlParts = generation.image!.split("?")[0].split(".");
        return urlParts[urlParts.length - 1] || "png";
      };

      const extension = getFileExtension();
      const filename = `printpetz_${Date.now()}.${extension}`;

      const file = new File([blob], filename, {
        type: blob.type || "image/png",
      });

      // Check if Web Share API is supported and can share files
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Check out my PrintPetz creation!",
          text: "Generated image from PrintPetz",
        });
        return;
      }

      // Fallback: Copy image URL to clipboard
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
        className={cn("rounded-xl bg-black-90 border-none max-w-xl")}
      >
        <DialogHeader className="flex-row justify-between items-center">
          <DialogTitle className="flex gap-3">
            {chips.map((item, i) => (
              <div key={i} className="bg-black-80 px-4 py-2 rounded-lg text-sm">
                {item}
              </div>
            ))}
          </DialogTitle>
          <DialogClose onClick={onClose} className="cursor-pointer text-black-40">
            <CancelIcon size={22} />
          </DialogClose>
        </DialogHeader>

        <div className="w-full flex gap-5">
          <div className="flex-1 flex flex-col gap-2">
            <div className="w-full aspect-[4/5] relative flex-1 rounded-lg overflow-hidden bg-black-100">
              {generation.image && <CustomImagePreview image={generation.image} />}
            </div>
            <div className="flex gap-3">
              <Button
                variant={"secondary"}
                className="w-fit px-2 aspect aspect-square"
                onClick={handleShare}
              >
                <ShareIcon size={22} />
              </Button>
              <Button className="flex-1" onClick={() => handleDownloadImage(generation.image)}>
                <DownloadIcon size={22} />
                Download
              </Button>
              {/* <Button className="flex-1" variant={"secondary"}>
                <PrinterIcon size={22} />
                Print
              </Button> */}
            </div>
          </div>
          <div className="flex flex-col gap-3 w-[110px]">
            {[null, ...mockupConfigs].map((mockupConfig, i) => (
              <div
                key={i}
                className={`relative rounded-md flex-1 aspect-[4/5] overflow-hidden bg-black-100`}
              >
                {generation.image && (
                  <AutoSmartMockup mockupConfig={mockupConfig} design={generation.image} />
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
