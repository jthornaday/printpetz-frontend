import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type Props<T extends React.ElementType> = {
  icon?: T;
  iconProps?: React.ComponentProps<T>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  props?: React.ComponentProps<typeof Button>;
  children?: React.ReactNode;
};

export const IconButton = <T extends React.ElementType>({
  icon: Icon,
  props,
  iconProps,
  onClick,
  ariaLabel,
  className,
  disabled,
  children,
}: Props<T>) => {
  return (
    <Button
      variant="link"
      size="icon"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn("p-0", className)}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon {...(iconProps as React.ComponentProps<T>)} />}
      {children}
    </Button>
  );
};
