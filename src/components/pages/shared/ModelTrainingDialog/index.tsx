import { CancelIcon } from "@/components/icons";
import {
  DialogHeader,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { UploadGuidance } from "./components/UploadGuidance";
import { ModelTrainingForm } from "./components/ModelTrainingForm";
import { useState } from "react";
import { RequestSubmitted } from "./components/RequestSubmitted";
import { useAppDispatch, useAppSelector } from "@/store";
import { setAppContext } from "@/store/slices/appContextSlice";

export const ModelTrainingDialog = () => {
  const dispatch = useAppDispatch();

  const { isModelTrainingDialogOpen } = useAppSelector((state) => state.appContext);

  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);

  const handleOnClose = () => {
    dispatch(setAppContext({ isModelTrainingDialogOpen: false }));
  };

  return (
    <Dialog open={isModelTrainingDialogOpen} onOpenChange={handleOnClose}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "h-[90dvh] w-[calc(100%_-_1.5rem)] max-w-5xl min-w-0 gap-0 overflow-hidden rounded-xl border-none bg-black-90 p-0 sm:w-14/16 lg:h-2/3"
        )}
      >
        <DialogHeader className="flex-row justify-between items-center p-4 border-b-[1px] border-black-70">
          <DialogTitle>Train Your Model</DialogTitle>
          <DialogClose onClick={handleOnClose} className="cursor-pointer text-black-40">
            <CancelIcon size={22} />
          </DialogClose>
        </DialogHeader>

        <div className="flex w-full min-h-0 flex-1 flex-col overflow-y-auto md:flex-row">
          {isRequestSubmitted ? (
            <RequestSubmitted />
          ) : (
            <>
              <UploadGuidance />
              <ModelTrainingForm setIsRequestSubmitted={setIsRequestSubmitted} />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
