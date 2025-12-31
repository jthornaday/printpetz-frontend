import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Loader } from "./loader";

const buttonVariants = cva(
  "w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold transition-all disabled:pointer-events-none disabled:bg-black-70 disabled:text-black-50 shrink-0 [&_svg]:shrink-0 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-black-70 text-white hover:bg-black-70/80",
        destructive: "bg-red text-white hover:bg-red/90 !disabled:border !disabled:border-red",
        outline: "border border-gray-800 hover:border-gray-700 font-normal",
        link: "bg-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 text-base rounded-md px-6 has-[>svg]:px-4",
        icon: "size-8 p-1",
        iconLarge: "size-10",
      },
      rounded: {
        true: "rounded-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  rounded,
  loading,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, rounded, className }))}
      {...props}
    >
      {loading ? <Loader size={20} /> : children}
    </Comp>
  );
}

export { Button, buttonVariants };
