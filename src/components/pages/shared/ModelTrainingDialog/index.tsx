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
        className={cn("rounded-xl bg-black-90 border-none max-w-5xl gap-0 p-0 h-2/3")}
      >
        <DialogHeader className="flex-row justify-between items-center p-4 border-b-[1px] border-black-70">
          <DialogTitle>Train Your Model</DialogTitle>
          <DialogClose onClick={handleOnClose} className="cursor-pointer text-black-40">
            <CancelIcon size={22} />
          </DialogClose>
        </DialogHeader>

        <div className="w-full flex flex-1 overflow-auto">
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
