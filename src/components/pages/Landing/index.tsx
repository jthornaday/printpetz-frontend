import React from "react";
import { Header } from "./components/Header";

import { Footer } from "@/components/shared/Footer";
import { Plan } from "@/components/pages/Plan";
import { CTA } from "./components/CTA";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { StylesGrid } from "./components/StylesGrid";

export const Landing = () => {
  return (
    <div className="text-white">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <div className="relative overflow-hidden py-20">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-80 aspect-square rounded-full bg-primary-dark pointer-events-none blur-[300px]" />
          <Plan />
        </div>
        <StylesGrid />
        <CTA />
      </main>
      <div className="relative">
        <Footer />
      </div>
    </div>
  );
};
