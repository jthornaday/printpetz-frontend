import { CaretIcon, CreditIcon, LogoutIcon, UserIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmationDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ROUTES } from "@/routes";
import { useSignOutMutation } from "@/store/api/authApi";
import { useGetUser } from "@/hooks/user/useGetUser";
import { useRouter } from "next/router";
import { useState } from "react";
import { UserProfileImage } from "../shared/UserProfileImage";
import { Loader } from "@/components/ui/loader";
import { useAppDispatch } from "@/store";
import { setAppContext } from "@/store/slices/appContextSlice";

export const ProfilePopover = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user, isUserLoading } = useGetUser();

  const [open, setOpen] = useState(false);

  const [signout, { isLoading: isSignoutLoading }] = useSignOutMutation();

  const handleSignout = async () => {
    await signout({});
    return true;
  };

  const openProfileDrawer = () => {
    setOpen(false);
    dispatch(setAppContext({ isProfileDrawerOpen: true }));
  };

  if (isUserLoading || !user) return <Loader />;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex gap-2.5 items-center cursor-pointer">
        <UserProfileImage
          image={user?.profile_image}
          text={user?.name ?? user.email}
          className="bg-black-80"
        />
        <CaretIcon size={18} className="rotate-x-180 transition duration-300" />
      </PopoverTrigger>

      <PopoverContent
        sideOffset={15}
        align="end"
        className="w-80 p-0 rounded-lg bg-black-90 border border-black-80 shadow-xl"
      >
        <div className="p-4 flex flex-col gap-4 border-b-[1px] border-black-70">
          {/* Top Section */}
          <div className="flex items-center gap-3">
            <UserProfileImage image={user?.profile_image} text={user?.name ?? user.email} />
            <div>
              {user?.name && <p className="text-[#171524] font-black text-sm">{user.name}</p>}
              <p className="text-sm text-black-40">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Credit Usage */}
        <div className="p-4 border-b-[1px] border-black-70 bg-black-80">
          <div className="flex justify-between mb-1">
            <span className="text-[#403a4b] text-sm flex items-center gap-2 font-bold">
              <CreditIcon size={20} />
              Credit Usage
            </span>
            <span className="text-sm text-primary font-bold">{user?.credits} credits left</span>
          </div>

          {/* Upgrade Button */}
          <Button
            onClick={() => {
              setOpen(false);
              router.push(ROUTES.plan);
            }}
            className="mt-2"
          >
            Buy More
          </Button>
        </div>

        {/* My Account */}
        <div
          className="p-4 w-full flex text-sm items-center gap-3 text-black-40 font-bold border-b-[1px] border-black-70 cursor-pointer"
          onClick={openProfileDrawer}
        >
          <UserIcon size={20} />
          My Account
        </div>

        {/* Logout */}
        <ConfirmationDialog
          title="Logout"
          description={`Are you absolutely sure? You'll need to login again to continue.`}
          confirmText="Yes, Logout"
          isLoading={isSignoutLoading}
          onConfirm={handleSignout}
          trigger={
            <div className="p-4 w-full text-sm flex items-center gap-3 text-red font-bold cursor-pointer">
              <LogoutIcon size={20} />
              Logout
            </div>
          }
        />
      </PopoverContent>
    </Popover>
  );
};
