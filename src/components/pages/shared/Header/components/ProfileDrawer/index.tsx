import { CancelIcon } from "@/components/icons";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { ProfileSection } from "./components/ProfileSection";
import { ModelSection } from "./components/ModelSection";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ProfileDrawer = ({ open, onOpenChange }: Props) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="bg-black-100 text-white border-l border-black-70">
        {/* Header */}
        <DrawerHeader className="flex flex-row justify-between items-center p-4 border-b border-black-70">
          <DrawerTitle className="text-white text-lg font-bold">My Account</DrawerTitle>

          {/* Close Button */}
          <DrawerClose className="cursor-pointer opacity-70 hover:opacity-100">
            <CancelIcon />
          </DrawerClose>
        </DrawerHeader>

        <div className="flex flex-col p-4 gap-2.5 overflow-y-auto h-full">
          {/* --- Profile Section --- */}
          <ProfileSection />

          {/* --- Model Section --- */}
          <ModelSection />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
