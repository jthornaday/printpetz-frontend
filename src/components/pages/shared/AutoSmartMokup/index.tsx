import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import React, { useEffect, useRef, useState } from "react";

interface AutoSmartMockupProps {
  mockup?: string; // optional mockup URL
  design: string; // generated/original image
  width?: number; // render width
}

const AutoSmartMockup: React.FC<AutoSmartMockupProps> = ({ mockup, design, width = 110 }) => {
  const [area, setArea] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  // Detect transparent area in mockup
  // useEffect(() => {
  //   if (!mockup) return;

  //   const img = new Image();
  //   img.crossOrigin = "anonymous";
  //   img.src = mockup;

  //   img.onload = () => {
  //     const canvas = document.createElement("canvas");
  //     const ctx = canvas.getContext("2d");
  //     if (!ctx) return;

  //     canvas.width = img.width;
  //     canvas.height = img.height;

  //     ctx.drawImage(img, 0, 0);
  //     const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

  //     // Detect transparent bounding box
  //     let minX = Infinity,
  //       minY = Infinity,
  //       maxX = -Infinity,
  //       maxY = -Infinity;

  //     for (let y = 0; y < data.height; y++) {
  //       for (let x = 0; x < data.width; x++) {
  //         const i = (y * data.width + x) * 4;
  //         const alpha = data.data[i + 3];

  //         if (alpha < 50) {
  //           // transparent threshold
  //           minX = Math.min(minX, x);
  //           maxX = Math.max(maxX, x);
  //           minY = Math.min(minY, y);
  //           maxY = Math.max(maxY, y);
  //         }
  //       }
  //     }

  //     if (minX !== Infinity) {
  //       setArea({
  //         x: minX,
  //         y: minY,
  //         w: maxX - minX,
  //         h: maxY - minY,
  //       });
  //     }
  //   };
  // }, [mockup]);

  // If no mockup → return plain generated image
  if (!mockup) {
    return <CustomImagePreview image={design} />;
  }

  return (
    <div>
      {/* Mockup Base */}
      <CustomImagePreview image={mockup} />

      {/* Auto-placed generated artwork */}
      <div className="relative w-20 aspect-square">
        <CustomImagePreview image={design} />
      </div>
      {/* <img
        src={design}
        style={{
          position: "absolute",
          left: `${(area.x / 1000) * width}px`,
          top: `${(area.y / 1000) * width}px`,
          width: `${(area.w / 1000) * width}px`,
          height: `${(area.h / 1000) * width}px`,
          objectFit: "cover",
          borderRadius: 4,
          pointerEvents: "none",
        }}
      /> */}
    </div>
  );
};

export default AutoSmartMockup;
