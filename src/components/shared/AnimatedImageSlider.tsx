import { CustomImagePreview } from "./CustomImagePreview";
import { StaticImageData } from "next/image";

import img1 from "@/utils/images/sliderImages/1.png";
import img2 from "@/utils/images/sliderImages/2.png";
import img3 from "@/utils/images/sliderImages/3.png";
import img4 from "@/utils/images/sliderImages/4.png";
import img5 from "@/utils/images/sliderImages/5.png";
import img6 from "@/utils/images/sliderImages/6.png";
import img7 from "@/utils/images/sliderImages/7.png";
import img8 from "@/utils/images/sliderImages/8.png";
import img9 from "@/utils/images/sliderImages/9.png";

const petImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

const SliderImage = ({ image }: { image: string | StaticImageData }) => (
  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-black-60 shadow-[0_18px_45px_rgba(31,25,66,.12)]">
    <CustomImagePreview
      image={image}
      className="object-cover"
    />
  </div>
);

export const AnimatedImageSlider = () => {
  return (
    <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-[#f7f4ff] p-10 lg:flex">
      <div className="absolute -left-24 -top-24 size-72 rounded-full bg-[#ffdd79]/35 blur-[80px]" />
      <div className="absolute -bottom-24 -right-20 size-80 rounded-full bg-[#a796ff]/30 blur-[90px]" />
      <div className="relative grid w-full max-w-[650px] grid-cols-3 gap-4">
        {petImages.map((image, index) => (
          <div key={index} className={index % 3 === 1 ? "translate-y-8" : ""}>
            <SliderImage image={image} />
          </div>
        ))}
      </div>
    </div>
  );
};
