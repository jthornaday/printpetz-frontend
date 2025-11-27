import { cn } from "@/lib/utils";
import { useGetUserByIdQuery } from "@/store/api/userApi";
import { ComponentProps } from "react";

export const Avatar = ({ className, ...props }: ComponentProps<"div">) => {
  const { data } = useGetUserByIdQuery();
  const { data: user } = data || {};

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
