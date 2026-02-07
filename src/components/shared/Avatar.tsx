import { cn } from "@/lib/utils";
import { useGetUser } from "@/hooks/user/useGetUser";
import { ComponentProps } from "react";
import { Loader } from "../ui/loader";

export const Avatar = ({ className, ...props }: ComponentProps<"div">) => {
  const { user, isUserFetching } = useGetUser();

  if (isUserFetching) {
    return <Loader />;
  }

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
