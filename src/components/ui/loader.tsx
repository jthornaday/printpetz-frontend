import { cn } from "@/lib/utils";
import { IconProps } from "@/types/common";
import React from "react";
import { createPortal } from "react-dom";
import { LoadingIcon } from "../icons";

type LoaderProps = {
  size?: number;
  colorClass?: string;
};

export const Loader = ({ className, ...props }: IconProps) => {
  return <LoadingIcon className={cn(className)} {...props} />;
};

const BodyLoader: React.FC<LoaderProps> = ({ size = 32, colorClass }) => {
  const spinner = (
    <div
      className={cn(`animate-spin rounded-full border-b-2 border-primary ${colorClass}`)}
      style={{ width: size, height: size }}
    />
  );

  return <div className="fixed inset-0 z-50 flex items-center justify-center">{spinner}</div>;
};

export const FullScreenLoader = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;

  // Create a portal into document.body
  return createPortal(<BodyLoader />, document.body);
};

export const PageLoader = (props: LoaderProps) => (
  <div className="min-h-screen overflow-hidden">
    <BodyLoader {...props} />
  </div>
);
