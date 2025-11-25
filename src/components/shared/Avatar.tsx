import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store";
import { ComponentProps } from "react";

export const Avatar = ({ className, ...props }: ComponentProps<"div">) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return;
  }

  const avatarText = (user.name ?? user.email).slice(0, 2).toUpperCase();

  return (
    <div
      className={cn(
        "w-full h-full bg-primary rounded-full flex items-center justify-center text-white font-bold",
        className
      )}
      {...props}
    >
      <span className="drop-shadow-lg">{avatarText}</span>
    </div>
  );
};
