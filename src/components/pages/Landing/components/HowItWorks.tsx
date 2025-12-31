import React from "react";
import { Upload, Wand2, Download } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Upload Your Pet's Photos",
      description: "Add 3-5 clear images of your furry friend.",
      icon: <Upload className="w-6 h-6 text-white" />,
    },
    {
      number: "2",
      title: "We Train an AI Model",
      description: "In about 10 minutes, we turn your pet into a personalized digital avatar.",
      icon: <Wand2 className="w-6 h-6 text-white" />,
    },
    {
      number: "3",
      title: "Generate & Download",
      description: "Choose from tons of fun styles. View, download, or print.",
      icon: <Download className="w-6 h-6 text-white" />,
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-black-40 max-w-2xl mx-auto">
            Just three easy steps to turn your pet photos into personalized AI images — ready to
            view, share, or print.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center group">
              {/* Step Number Circle */}
              <div className="w-24 h-24 rounded-full bg-[#1A1B23] border border-gray-800 flex items-center justify-center mb-6 relative z-10 group-hover:border-violet-500/50 group-hover:shadow-[0_0_30px_-10px_rgba(124,58,237,0.3)] transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-[#13141C] flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-700 group-hover:text-violet-500 transition-colors">
                    {step.number}
                  </span>
                </div>
                {/* Icon Badge */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center border-4 border-[#0B0C10]">
                  {step.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-black-40 leading-relaxed max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
