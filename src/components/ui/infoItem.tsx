import { cn } from "@/lib/utils";
import React from "react";

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  className?: string;
  valueClassName?: string;
}

export const InfoItem = ({ label, value, className, valueClassName }: InfoItemProps) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={cn("text-sm font-semibold", valueClassName)}>{value}</dd>
    </div>
  );
};

export function InfoItemsWrapper({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDListElement>) {
  return (
    <dl className={cn("flex gap-4", className)} {...props}>
      {children}
    </dl>
  );
}
