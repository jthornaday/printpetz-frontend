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
import img10 from "@/utils/images/sliderImages/10.png";
import img11 from "@/utils/images/sliderImages/11.png";
import img12 from "@/utils/images/sliderImages/12.png";
import img13 from "@/utils/images/sliderImages/13.png";
import img14 from "@/utils/images/sliderImages/14.png";
import img15 from "@/utils/images/sliderImages/15.png";
import img16 from "@/utils/images/sliderImages/16.png";
import img17 from "@/utils/images/sliderImages/17.png";
import img18 from "@/utils/images/sliderImages/18.png";
import img19 from "@/utils/images/sliderImages/19.png";
import img20 from "@/utils/images/sliderImages/20.png";
import img21 from "@/utils/images/sliderImages/21.png";
import img22 from "@/utils/images/sliderImages/22.png";

const petImages = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
  img14,
  img15,
  img16,
  img17,
  img18,
  img19,
  img20,
  img21,
  img22,
];

const getColumnImages = (start: number) => {
  const count = 10;
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(petImages[(start + i) % petImages.length]);
  }
  return result;
};

const SliderImage = ({ image }: { image: string | StaticImageData }) => (
  <div className="relative w-full aspect-[4/5] rounded-[20px] overflow-hidden object-cover transition duration-300 cursor-pointer transform bg-black-60 select-none">
    <CustomImagePreview
      image={image}
      className="object-cover hover:scale-110 transition duration-500"
    />
  </div>
);

const SliderColumn = ({ imageList }: { imageList: (string | StaticImageData)[] }) => (
  <div className="slider-mover flex flex-col">
    <div className="flex flex-col gap-4 p-2">
      {imageList.map((image, index) => (
        <SliderImage key={index} image={image} />
      ))}
    </div>
    <div className="flex flex-col gap-4 p-2">
      {imageList.map((image, index) => (
        <SliderImage key={index} image={image} />
      ))}
    </div>
  </div>
);

export const AnimatedImageSlider = () => {
  // Create 5 columns of 10 images each, reusing images
  const col1 = getColumnImages(8);
  const col2 = getColumnImages(16);
  const col3 = getColumnImages(4);
  const col4 = getColumnImages(12);
  const col5 = getColumnImages(0);

  return (
    <div className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden">
      <div className="relative flex rotate-20 min-w-[1260px] md:scale-75 lg:scale-90 2xl:scale-100">
        <div className="slide_t-b flex-1 flex flex-col">
          <SliderColumn imageList={col1} />
        </div>
        <div className="slide_b-t flex-1 flex flex-col">
          <SliderColumn imageList={col2} />
        </div>
        <div className="slide_t-b flex-1 flex flex-col">
          <SliderColumn imageList={col3} />
        </div>
        <div className="slide_b-t flex-1 flex flex-col">
          <SliderColumn imageList={col4} />
        </div>
        <div className="slide_t-b flex-1 flex flex-col">
          <SliderColumn imageList={col5} />
        </div>
      </div>
    </div>
  );
};
