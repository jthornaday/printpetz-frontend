import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { CancelIcon } from "../icons";

type Props = {
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  trigger?: React.ReactNode;
  onConfirm: () => Promise<boolean>;
  isLoading?: boolean;
  wrapperClass?: string;
};

export const ConfirmationDialog = ({
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Confirm",
  trigger,
  isLoading,
  wrapperClass,
  onConfirm,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    const success = await onConfirm();
    if (success) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        {trigger}
      </DialogTrigger>
      <DialogContent
        onOutsideClick={(e) => e.stopPropagation()}
        showCloseButton={false}
        onClick={(e) => e.stopPropagation()}
        className={cn("w-md text-center p-6 rounded-xl bg-black-90 border-none gap-6", wrapperClass)}
      >
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle className="text-center font-bold">{title}</DialogTitle>
          <DialogClose className="cursor-pointer opacity-70 hover:opacity-100">
            <CancelIcon />
          </DialogClose>
        </DialogHeader>
        <DialogDescription className="text-sm font-normal text-left text-black-40">{description}</DialogDescription>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" className="w-fit" onClick={() => setIsOpen(false)}>
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            className="w-fit"
            loading={isLoading}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
