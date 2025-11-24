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

type Props = {
  generation: IGenerationViewItem;
  chips: string[];
  onClose: () => void;
};

export const GenerationPreviewDialog = ({ generation, chips, onClose }: Props) => {
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

  const handleShare = async () => {
    if (!generation.image) return;
    try {
      // Fetch image as blob
      const response = await fetch(generation.image);
      const blob = await response.blob();

      const file = new File([blob], "printpetz_" + Date.now() + generation.image.split(".")[1], {
        type: blob.type,
      });

      // Check if share is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Check this image",
          text: "Generated image from printpetz",
        });
        return;
      }
    } catch (error) {
      console.error("Error sharing image:", error);
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
            <div className="w-full aspect-[4/5] relative flex-1 rounded-lg overflow-hidden">
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
              <Button className="flex-1" onClick={handleDownloadImage}>
                <DownloadIcon size={22} />
                Download
              </Button>
              {/* <Button className="flex-1" variant={"secondary"}>
                <PrinterIcon size={22} />
                Print
              </Button> */}
            </div>
          </div>
          {/* <div className="flex flex-col gap-3 w-[110px]">
            {["white", "red", "orange", "primary"].map((color) => (
              <div
                key={color}
                className={`relative rounded-md flex-1 aspect-[4/5] overflow-hidden`}
              >
                {generation.image && (
                  <AutoSmartMockup
                    mockup="https://images.unsplash.com/photo-1629740067905-bd3f515aa739?q=50"
                    design={generation.image}
                  />
                )}
              </div>
            ))}
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
