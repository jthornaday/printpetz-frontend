import { useRouter } from "next/router";
import React from "react";
import { AnimatedImageSlider } from "../shared/AnimatedImageSlider";
import { authRoutes, userRoutes } from "@/utils/constants/appConstants";
import { ROUTES } from "@/routes";
import { Header } from "../pages/shared/Header";
import { Sidebar } from "../pages/shared/Sidebar";
import { cn } from "@/lib/utils";
import { useGetUserByIdQuery } from "@/store/api/userApi";

type Props = {
  children: React.ReactNode;
} & React.ComponentProps<"div">;

const DefaultWrapper = ({ children, className }: Props) => (
  <div className="min-h-screen overflow-hidden bg-black-100">
    <div className={cn("h-screen min-h-[850px]", className)}>{children}</div>
  </div>
);

export const PageWrapper = ({ children }: Props) => {
  const router = useRouter();

  const showAnimatedSliderRoutes = authRoutes.concat(ROUTES.resetPassword);

  const { data } = useGetUserByIdQuery();
  const { data: user } = data || {};

  if (!user && !authRoutes.includes(router.pathname)) {
    return;
  }

  if (showAnimatedSliderRoutes.includes(router.pathname)) {
    return (
      <DefaultWrapper className="flex">
        {/* Left Side - Auth Part */}
        {children}

        {/* Right Side - Image Gallery */}
        <AnimatedImageSlider />
      </DefaultWrapper>
    );
  }

  if (userRoutes.includes(router.pathname)) {
    return (
      <DefaultWrapper className="flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-auto">
          <Sidebar />
          {children} {/* Main Content */}
        </div>
      </DefaultWrapper>
    );
  }

  return <DefaultWrapper>{children}</DefaultWrapper>;
};
