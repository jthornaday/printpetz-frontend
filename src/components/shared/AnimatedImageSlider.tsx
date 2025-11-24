import { CustomImagePreview } from "./CustomImagePreview";
import { samplePetImages } from "@/utils/constants/samplePetImages";

const SliderImage = ({ image }: { image: string }) => (
  <div className="relative w-full aspect-[4/5] rounded-[20px] overflow-hidden object-cover transition duration-300 cursor-pointer transform bg-black-60 select-none">
    <CustomImagePreview
      image={image}
      className="object-cover hover:scale-110 transition duration-500"
    />
  </div>
);

const SliderColumn = ({ imageList }: { imageList: string[] }) => (
  <>
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
  </>
);

export const AnimatedImageSlider = () => (
  <div className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden">
    <div className="relative flex rotate-20 min-w-[1260px] md:scale-75 lg:scale-90 2xl:scale-100">
      <div className="slide_b-t flex-1 flex flex-col">
        <SliderColumn imageList={samplePetImages} />
      </div>
      <div className="slide_t-b flex-1 flex flex-col">
        <SliderColumn imageList={samplePetImages} />
      </div>
      <div className="slide_b-t flex-1 flex flex-col">
        <SliderColumn imageList={samplePetImages} />
      </div>
      <div className="slide_t-b flex-1 flex flex-col">
        <SliderColumn imageList={samplePetImages} />
      </div>
      <div className="slide_b-t flex-1 flex flex-col">
        <SliderColumn imageList={samplePetImages} />
      </div>
    </div>
  </div>
);
