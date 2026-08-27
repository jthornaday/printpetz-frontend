import { PrintPetzWordmark } from "@/components/shared/PrintPetzWordmark";
import { Button } from "@/components/ui/button";
import { ThunderIcon } from "@/components/icons";
import { useRouter } from "next/router";
import { ROUTES } from "@/routes";
import { ProfilePopover } from "./components/ProfilePopover";
import { ProfileDrawer } from "./components/ProfileDrawer";
import { useEffect } from "react";
import { useGetUser } from "@/hooks/user/useGetUser";

export const Header = () => {
  const router = useRouter();

  const { user, refetch } = useGetUser();

  useEffect(() => {
    const timeout = setTimeout(() => refetch(), 1000);

    return () => clearTimeout(timeout);
  }, [refetch]);

  return (
    <header className="border-b border-[#e7e2ee] bg-white px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-13 items-center">
            <PrintPetzWordmark className="text-3xl" />
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Button
            onClick={() => router.push(ROUTES.plan)}
            variant={"link"}
            className="w-fit p-0 underline underline-offset-2 text-orange font-bold hover:opacity-90 transition"
          >
            Buy more
          </Button>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-3 pl-2.5 pr-4 py-2 rounded-full border border-black-70">
              <ThunderIcon size={16} className="text-yellow" />
              <span className="font-semibold text-[#171524]">{user?.credits}</span>
            </div>
            {/* Profile Popover */}
            <ProfilePopover />

            {/* Profile Drawer */}
            <ProfileDrawer />
          </div>
        </div>
      </div>
    </header>
  );
};
