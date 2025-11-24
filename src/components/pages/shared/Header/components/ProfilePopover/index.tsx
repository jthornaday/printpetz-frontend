import { CaretIcon, CreditIcon, LogoutIcon, UserIcon } from "@/components/icons";
import { Avatar } from "@/components/shared/Avatar";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ROUTES } from "@/routes";
import { useAppSelector } from "@/store";
import { useSignOutMutation } from "@/store/api/authApi";
import { useGetUserByIdQuery } from "@/store/api/userApi";
import { useRouter } from "next/router";
import { useState } from "react";

type Props = { openProfile: () => void };

export const ProfilePopover = ({ openProfile }: Props) => {
  const router = useRouter();

  const { user: supabaseUser } = useAppSelector((state) => state.auth);

  const { data: user } = useGetUserByIdQuery(supabaseUser?.id ?? "");

  const [open, setOpen] = useState(false);

  const [handleSignout, { isLoading: isSignoutLoading }] = useSignOutMutation();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex gap-2.5 items-center cursor-pointer">
        <div className="relative w-10 h-10 rounded-full bg-primary flex items-center justify-center text-lg font-semibold overflow-hidden">
          {user?.profile_image ? <CustomImagePreview image={user?.profile_image} /> : <Avatar />}
        </div>
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
            <div className="relative w-10 h-10 rounded-full bg-primary flex items-center justify-center text-lg font-semibold overflow-hidden">
              {user?.profile_image ? <CustomImagePreview image={user?.profile_image} /> : <Avatar />}
            </div>
            <div>
              {user?.name && <p className="text-white font-black text-sm">{user.name}</p>}
              <p className="text-sm text-black-40">{user?.email}</p>
            </div>
          </div>

          {/* Upgrade Button */}
          <Button
            onClick={() => {
              setOpen(false);
              router.push(ROUTES.pricing);
            }}
          >
            Upgrade
          </Button>
        </div>

        {/* Credit Usage */}
        <div className="p-4 border-b-[1px] border-black-70 bg-black-80">
          <div className="flex justify-between mb-1">
            <span className="text-gray-300 text-sm flex items-center gap-2 font-bold">
              <CreditIcon size={20} />
              Credit Usage
            </span>
            <span className="text-sm text-primary font-bold">{user?.credit} credits left</span>
          </div>

          {/* <div className="h-2 mt-3.5 bg-black-70 rounded-lg overflow-hidden">
            <div className="h-full bg-primary w-[80%]" />
          </div> */}
        </div>

        {/* My Account */}
        <div
          className="p-4 w-full flex text-sm items-center gap-3 text-black-40 font-bold border-b-[1px] border-black-70 cursor-pointer"
          onClick={() => {
            setOpen(false);
            openProfile();
          }}
        >
          <UserIcon size={20} />
          My Account
        </div>

        {/* Logout */}
        <div
          className="p-4 w-full text-sm flex items-center gap-3 text-red font-bold cursor-pointer"
          onClick={handleSignout}
        >
          {isSignoutLoading ? <Loader size={20} /> : <LogoutIcon size={20} />}
          Logout
        </div>
      </PopoverContent>
    </Popover>
  );
};
