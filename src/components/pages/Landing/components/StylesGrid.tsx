import React from "react";
import astronautImage from "@/utils/images/landingPage/styles/astronaut.png";
import policeOfficerImage from "@/utils/images/landingPage/styles/police-officer.png";
import kingImage from "@/utils/images/landingPage/styles/king.png";
import skateboardImage from "@/utils/images/landingPage/styles/skateboard.png";
import boxingImage from "@/utils/images/landingPage/styles/boxing.png";
import queenImage from "@/utils/images/landingPage/styles/queen.png";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { StaticImageData } from "next/image";

interface ItemProps {
  name: string;
  image: StaticImageData;
}

const StyleItem = ({ name, image }: ItemProps) => (
  <div className="flex flex-col aspect-[4/5] rounded-lg overflow-hidden transition cursor-pointer border bg-black-80 border-transparent">
    <div className="relative flex-grow">
      <CustomImagePreview image={image} />
    </div>
    <label className="text-xs cursor-pointer font-semibold text-center px-1 py-2 text-black-30">
      {name}
    </label>
  </div>
);

export const StylesGrid = () => {
  const styles = [
    { name: "Skateboard", image: skateboardImage },
    { name: "Boxing", image: boxingImage },
    { name: "Police Officer", image: policeOfficerImage },
    { name: "Astronaut", image: astronautImage },
    { name: "King", image: kingImage },
    { name: "Queen", image: queenImage },
  ];

  return (
    <section className="py-24 px-6 flex justify-center">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-10 md:gap-20">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-6">
            Explore Dozens of Fun Styles
          </h2>
          <p className="text-black-40 text-lg leading-relaxed">
            One click, transform your pet photo into stunning artwork instantly with AI - from
            classic to cartoon. Prepare to be hooked!
          </p>
        </div>

        {/* Grid of Styles */}
        <div className="w-full flex-1 max-w-md grid grid-cols-3 gap-4">
          {styles.map((style, index) => (
            <StyleItem key={index} name={style.name} image={style.image} />
          ))}
        </div>
      </div>
    </section>
  );
};
