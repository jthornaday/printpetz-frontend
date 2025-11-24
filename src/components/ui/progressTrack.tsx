import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { RobotIcon } from "@/components/icons/RobotIcon";

const trackVariants = cva("relative h-2 w-full rounded-full my-2 transition-colors", {
  variants: {
    motion: {
      forward: "bg-light-green",
      backward: "bg-light-blue",
    },
  },
  defaultVariants: {
    motion: "forward",
  },
});

const robotVariants = cva("absolute top-1/2 -translate-y-1/2 transition-transform duration-300", {
  variants: {
    motion: {
      forward: "rotate-180 text-green",
      backward: "rotate-0 text-blue",
    },
  },
  defaultVariants: {
    motion: "forward",
  },
});

interface ProgressTrackProps extends VariantProps<typeof trackVariants> {
  value: number;
  max?: number;
  className?: string;
}

export const ProgressTrack = ({ value, max = 255, motion, className }: ProgressTrackProps) => {
  const clamped = Math.min(Math.max(value, 0), max);
  const percentage = (clamped / max) * 100;

  return (
    <div className={cn(trackVariants({ motion }), className)}>
      <div className={robotVariants({ motion })} style={{ left: `${percentage}%` }}>
        <RobotIcon size={22} />
      </div>
    </div>
  );
};
