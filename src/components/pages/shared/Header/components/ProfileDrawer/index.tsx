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
import { useAppDispatch, useAppSelector } from "@/store";
import { setAppContext } from "@/store/slices/appContextSlice";

export const ProfileDrawer = () => {
  const dispatch = useAppDispatch();

  const { isProfileDrawerOpen } = useAppSelector((state) => state.appContext);

  const closeDrawer = () => {
    dispatch(setAppContext({ isProfileDrawerOpen: false }));
  };

  return (
    <Drawer open={isProfileDrawerOpen} onOpenChange={closeDrawer} direction="right">
      <DrawerContent className="bg-white text-[#171524] border-l border-black-70">
        {/* Header */}
        <DrawerHeader className="flex flex-row justify-between items-center p-4 border-b border-black-70">
          <DrawerTitle className="text-[#171524] text-lg font-bold">My Account</DrawerTitle>

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
