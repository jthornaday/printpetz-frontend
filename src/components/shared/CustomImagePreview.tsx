import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

type Props = {
  image: string | StaticImageData;
  alt?: string;
  className?: string;
};

export const CustomImagePreview = ({ image, className, alt }: Props) => {
  const [isImgLoad, setIsImgLoad] = useState(false);

  useEffect(() => {
    if (isImgLoad) {
      setIsImgLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  return (
    <Image
      onLoad={() => setIsImgLoad(true)}
      fill
      priority
      src={image}
      alt={alt ?? "PrintPetz image"}
      className={cn(
        `${!isImgLoad && "opacity-0"} transition-all duration-500 pointer-events-none`,
        className
      )}
      quality={100}
    />
  );
};
