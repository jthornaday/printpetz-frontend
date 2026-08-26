import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import Logo from "@/utils/images/logo.png";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black-100/80 backdrop-blur-md border-b border-black-70 text-center">
      <div className="w-full max-w-7xl flex items-center justify-between m-auto">
        <div className="relative w-33 h-13 text-center">
          <CustomImagePreview image={Logo} />
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <Link href={ROUTES.shop} className="hover:text-white transition-colors">
            Shop
          </Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </Link>
          <Link href={ROUTES.login}>
            <Button>Sign In</Button>
          </Link>
        </nav>
        <Link href={ROUTES.shop} className="md:hidden">
          <Button size="sm">Shop</Button>
        </Link>
      </div>
    </header>
  );
};
