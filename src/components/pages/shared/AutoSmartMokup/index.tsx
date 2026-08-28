import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { StaticImageData } from "next/image";
import React from "react";

interface AutoSmartMockupProps {
  mockupConfig: {
    mockup: StaticImageData;
    width?: number;
    left?: number;
    top?: number;
  } | null;
  design: string;
}

const AutoSmartMockup: React.FC<AutoSmartMockupProps> = ({ mockupConfig, design }) => {
  // If no mockup → return plain generated image
  if (!mockupConfig) {
    return <CustomImagePreview image={design} className="object-cover object-[56%_center]" />;
  }

  // Use configuration
  const designStyle: React.CSSProperties = {
    position: "absolute",
    width: `${mockupConfig.width}%`,
    left: `${mockupConfig.left}%`,
    top: `${mockupConfig.top}%`,
    aspectRatio: "4/5",
  };

  return (
    <>
      {/* Mockup Base */}
      <CustomImagePreview image={mockupConfig.mockup} className="z-10" />

      {/* Auto-placed generated artwork */}
      <div style={designStyle}>
        <CustomImagePreview image={design} className="object-cover object-[56%_center]" />
      </div>
    </>
  );
};

export default AutoSmartMockup;
