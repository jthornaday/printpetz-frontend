import { useRouter } from "next/router";

import { ROUTES } from "@/routes";
import { CreditIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/store";
import { resetAppContext, setAppContext } from "@/store/slices/appContextSlice";

type InsufficientCreditsDialogProps = {
  open: boolean;
  onClose: () => void;
};

export const InsufficientCreditsDialog = ({ open, onClose }: InsufficientCreditsDialogProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isModelTrainingDialogOpen, isProfileDrawerOpen } = useAppSelector(
    (state) => state.appContext
  );

  const handleBuyCredits = () => {
    onClose();

    // Close model training dialog or profile drawer if it's open
    if (isModelTrainingDialogOpen || isProfileDrawerOpen) {
      dispatch(resetAppContext());
    }

    router.push(ROUTES.plan);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-md text-center p-8 rounded-xl bg-black-90 border-none gap-5"
      >
        <DialogHeader className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-yellow/10 ring-1 ring-yellow/30 flex items-center justify-center">
            <CreditIcon size={32} className="text-yellow" />
          </div>
          <DialogTitle className="text-xl font-bold text-yellow">
            You&apos;re Out of Credits!
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-sm text-black-40 text-center">
          You don&apos;t have enough credits to complete this action. Purchase more credits to
          continue creating amazing AI images of your pet.
        </DialogDescription>

        <div className="flex flex-col gap-2">
          <Button onClick={handleBuyCredits}>Buy Credits</Button>
          <Button variant="secondary" onClick={onClose}>
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
