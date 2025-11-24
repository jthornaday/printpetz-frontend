import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import Logo from "@/utils/images/logo.png";
import { Button } from "@/components/ui/button";
import { ThunderIcon } from "@/components/icons";
import { useRouter } from "next/router";
import { ROUTES } from "@/routes";
import { ProfilePopover } from "./components/ProfilePopover";
import { ProfileDrawer } from "./components/ProfileDrawer";
import { useState } from "react";
import { useAppSelector } from "@/store";
import { useGetUserByIdQuery } from "@/store/api/userApi";

export const Header = () => {
  const router = useRouter();

  const { user } = useAppSelector((state) => state.auth);

  const { data: userDetails } = useGetUserByIdQuery(user?.id || "", { skip: !user });

  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);

  return (
    <header className="border-b border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-33 h-13 text-center">
            <CustomImagePreview image={Logo} />
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Button
            onClick={() => router.push(ROUTES.pricing)}
            variant={"link"}
            className="w-fit p-0 underline underline-offset-2 text-orange font-bold hover:opacity-90 transition"
          >
            Upgrade
          </Button>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-3 pl-2.5 pr-4 py-2 rounded-full border border-black-70">
              <ThunderIcon size={16} className="text-yellow" />
              <span className="text-white font-semibold">{userDetails?.credit}</span>
            </div>

            {/* Profile Popover */}
            <ProfilePopover openProfile={() => setOpenProfileDrawer(true)} />

            <ProfileDrawer
              open={openProfileDrawer}
              onOpenChange={() => setOpenProfileDrawer(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
