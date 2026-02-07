import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes";
import { ArrowIcon } from "@/components/icons";
import createPageExampleImage from "@/utils/images/landingPage/create-page-example.png";
import modelSelectionExampleImage from "@/utils/images/landingPage/model-select-example.png";
import backgroundGridImage from "@/utils/images/landingPage/background-grid.svg";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";

export const Hero = () => {
  return (
    <section className="relative pt-32 px-6 flex flex-col items-center text-center overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center gap-6">
        <div className="w-fit px-4 py-2 rounded-full bg-black-80 text-sm font-bold text-primary">
          Turning Pet Photos into Art
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent">
          Turn Ordinary Pet Photos Into <br className="block" />
          <span className="text-primary">Extraordinary AI Art</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl">
          Upload your pet’s photos and let our AI reimagine them in fun, creative, and professional
          avatars. No subscriptions. Just unforgettable memories.
        </p>

        <Link href={ROUTES.create}>
          <Button size={"lg"}>
            {"Let's Start Magic"}
            <ArrowIcon className="rotate-180" />
          </Button>
        </Link>

        {/* Example image */}
        <div className="mt-15 relative w-full max-w-5xl aspect-video">
          <CustomImagePreview image={createPageExampleImage} />

          <div className="absolute bottom-0 right-0 h-fit">
            <div className="relative w-xs aspect-square">
              <CustomImagePreview image={modelSelectionExampleImage} />
            </div>
          </div>
        </div>
      </div>

      {/* Background grid */}
      <div className="absolute -bottom-60 left-0 right-0 w-full h-full [mask-image:linear-gradient(to_bottom,transparent,black)]">
        <CustomImagePreview image={backgroundGridImage} />
      </div>

      {/* Background effects */}
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-1/2 max-w-4xl aspect-[2] rounded-full bg-primary-dark pointer-events-none blur-[300px]" />
    </section>
  );
};
