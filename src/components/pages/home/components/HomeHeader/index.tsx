import { BrandLogo } from "@/components/icons";
import React from "react";

import { useSignoutUserMutation } from "@/store/api/authApi";
import { ConfirmationDialog } from "@/components/ui/confirmationDialog";

export const HomeHeader = () => {
  const [signoutUser, { isLoading }] = useSignoutUserMutation();

  const handleSignout = async () => {
    const res = await signoutUser();
    return !res?.error;
  };

  return (
    <div className="flex justify-between items-center ">
      <BrandLogo />

      <ConfirmationDialog
        title="Logout"
        description="Are you sure you want to logout?"
        confirmText="Logout"
        isLoading={isLoading}
        onConfirm={handleSignout}
        trigger={
          <div className="underline text-destructive underline-offset-4 cursor-pointer">Logout</div>
        }
      />
    </div>
  );
};
