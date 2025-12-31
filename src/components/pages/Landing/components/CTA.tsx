import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes";
import { Sparkles } from "lucide-react";
import superHeroImage from "@/utils/images/landingPage/superhero-example.png";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import backgroundGridImage from "@/utils/images/landingPage/background-grid.svg";
import { ArrowIcon } from "@/components/icons";

export const CTA = () => {
  return (
    <section className="py-20 px-6">
      <div className="relative max-w-5xl min-h-[600px] md:min-h-fit mx-auto overflow-hidden rounded-3xl bg-gradient-to-r from-violet-900/50 to-indigo-900/50 border border-white/10 p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="relative z-10 md:w-[60%] md:max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Generating Magical Pet Images
          </h2>
          <p className="text-violet-200 text-lg mb-8">
            {
              "Turn your pet’s photos into fun, creative AI portraits. Preview them on mugs, tees, and more — and make something truly adorable!"
            }
          </p>
          <Link href={ROUTES.create}>
            <Button className="w-fit">
              {"Let's Get Started"}
              <ArrowIcon className="rotate-y-180 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Background grid */}
        <div className="absolute -bottom-80 w-7xl aspect-square [mask-image:radial-gradient(circle_at_2px_2px,transparent,black)]">
          <CustomImagePreview image={backgroundGridImage} />
        </div>

        {/* Illustration/Image Placeholder */}
        <div className="absolute bottom-0 md:top-0 right-1/2 md:right-0 translate-x-1/2 md:translate-x-0 z-10 w-1/2 max-w-xs md:max-w-sm aspect-square">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-500 to-orange-400 rounded-full blur-3xl opacity-30 animate-pulse" />

          {/* Placeholder for a "Super Dog" image */}
          <CustomImagePreview image={superHeroImage} />
        </div>
      </div>
    </section>
  );
};
