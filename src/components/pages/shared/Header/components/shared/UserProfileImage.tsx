import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { cn } from "@/lib/utils";

const Avatar = ({ text }: { text: string }) => {
  const avatarText = text.slice(0, 2).toUpperCase();

  return (
    <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-white font-bold">
      <span className="drop-shadow-lg">{avatarText}</span>
    </div>
  );
};

export const UserProfileImage = ({
  image,
  text,
  className,
}: {
  image?: string | null;
  text: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative w-10 h-10 rounded-full bg-black-100 flex items-center justify-center text-lg font-semibold overflow-hidden",
        className
      )}
    >
      {image ? <CustomImagePreview image={image} /> : <Avatar text={text} />}
    </div>
  );
};
