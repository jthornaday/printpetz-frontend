import { Button } from "@/components/ui/button";
import {
  useEditImageLookMutation,
  useRemoveImageBackgroundMutation,
} from "@/store/api/generationApi";
import { useMemo, useState } from "react";

type Props = {
  image: string;
  modelId: number;
  styleId: number;
  onBack: () => void;
};

type LookLevel = 1 | 2 | 3;

type LookKey = "natural" | "mascot" | "cartoon";

const LOOKS: Array<{
  value: LookLevel;
  key: LookKey;
  label: string;
  description: string;
}> = [
  {
    value: 1,
    key: "natural",
    label: "Natural",
    description: "Real-pet facial proportions and detail, with the same full role and anthropomorphic body.",
  },
  {
    value: 2,
    key: "mascot",
    label: "Mascot",
    description: "Faithful pet identity with polished professional mascot styling.",
  },
  {
    value: 3,
    key: "cartoon",
    label: "Cartoon",
    description: "More illustrated and animated while keeping the pet recognizable.",
  },
];

const Slider = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  suffix?: string;
}) => (
  <label className="block">
    <div className="mb-1 flex items-center justify-between gap-3 text-xs font-semibold">
      <span className="text-[#171524]">{label}</span>
      <span className="text-black-40">{value}{suffix}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="w-full accent-primary"
    />
  </label>
);

export const ImageEditorPanel = (props: Props) => {
  const { image, onBack } = props;
  const [workingImage, setWorkingImage] = useState(image);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [backgroundRemoved, setBackgroundRemoved] = useState(false);
  const [selectedLook, setSelectedLook] = useState<LookLevel>(1);

  const [editImageLook, { isLoading: isChangingLook }] = useEditImageLookMutation();
  const [removeBackground, { isLoading: isRemovingBackground }] =
    useRemoveImageBackgroundMutation();

  const transform = useMemo(
    () =>
      `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotate(${rotation}deg) scale(${zoom / 100})`,
    [rotation, tiltX, tiltY, zoom],
  );

  const reset = () => {
    setWorkingImage(image);
    setZoom(100);
    setRotation(0);
    setTiltX(0);
    setTiltY(0);
    setBrightness(100);
    setBackgroundColor("#ffffff");
    setBackgroundRemoved(false);
    setSelectedLook(1);
  };

  const handleChangeLook = async () => {
    const activeLook = LOOKS.find((look) => look.value === selectedLook)!;

    try {
      const response = await editImageLook({
        imageUrl: workingImage,
        look: activeLook.key,
      }).unwrap();

      if (!response.success || !response.data?.imageUrl) {
        alert(response.message ?? "Could not apply the new look.");
        return;
      }

      setWorkingImage(response.data.imageUrl);
      setBackgroundRemoved(false);
    } catch (error) {
      console.error("Failed to change look", error);
      alert("Could not apply the new look. Please try again.");
    }
  };

  const handleRemoveBackground = async () => {
    try {
      const response = await removeBackground({ imageUrl: workingImage }).unwrap();
      if (response.success && response.data?.imageUrl) {
        setWorkingImage(response.data.imageUrl);
        setBackgroundRemoved(true);
      }
    } catch (error) {
      console.error("Failed to remove background", error);
      alert("Could not remove the background. Please try again.");
    }
  };

  const handleDownloadEdited = async () => {
    try {
      const response = await fetch(workingImage, { cache: "no-store" });
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const source = new Image();

      await new Promise<void>((resolve, reject) => {
        source.onload = () => resolve();
        source.onerror = () => reject(new Error("Could not load image"));
        source.src = objectUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1280;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(
        (zoom / 100) * Math.max(0.15, Math.cos((tiltY * Math.PI) / 180)),
        (zoom / 100) * Math.max(0.15, Math.cos((tiltX * Math.PI) / 180)),
      );
      ctx.filter = `brightness(${brightness}%)`;

      const imageRatio = source.width / source.height;
      const canvasRatio = canvas.width / canvas.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      if (imageRatio > canvasRatio) {
        drawHeight = canvas.width / imageRatio;
      } else {
        drawWidth = canvas.height * imageRatio;
      }

      ctx.drawImage(source, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();
      URL.revokeObjectURL(objectUrl);

      const editedBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png", 0.95),
      );
      if (!editedBlob) throw new Error("Could not export image");

      const downloadUrl = URL.createObjectURL(editedBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `printpetz-edited-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Failed to export edited image", error);
      alert("Could not download the edited image. Please try again.");
    }
  };

  const activeLook = LOOKS.find((look) => look.value === selectedLook)!;

  return (
    <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0">
        <div
          className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-xl border border-[#e7e2ee]"
          style={{ backgroundColor }}
        >
          <img
            src={workingImage}
            alt="Edit PrintPetz creation"
            className="h-full w-full object-contain transition-transform duration-150"
            style={{ transform, filter: `brightness(${brightness}%)` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-black-40">
          3D tilt rotates the 2D artwork as a flat card; it does not create unseen sides of the pet.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-[#e7e2ee] bg-white p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">PrintPetz Editor</p>
          <h3 className="mt-1 text-lg font-bold text-[#171524]">Make it yours</h3>
        </div>

        <div className="rounded-xl border border-[#e7e2ee] bg-[#fcfbff] p-3">
          <div className="mb-3">
            <p className="text-sm font-bold text-[#171524]">Change Look</p>
            <p className="mt-1 text-xs leading-5 text-black-40">
              Change the existing image without creating a new generation or using credits.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {LOOKS.map((look) => (
              <button
                key={look.value}
                type="button"
                onClick={() => setSelectedLook(look.value)}
                className={`rounded-lg border px-2 py-2 text-xs font-bold transition ${
                  selectedLook === look.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-[#e7e2ee] bg-white text-[#171524]"
                }`}
              >
                {look.label}
              </button>
            ))}
          </div>
          <p className="mt-2 min-h-10 text-xs leading-5 text-black-40">{activeLook.description}</p>
          <Button
            className="mt-2 w-full"
            loading={isChangingLook}
            disabled={isChangingLook}
            onClick={handleChangeLook}
          >
            Apply {activeLook.label} look — Free
          </Button>
        </div>

        <Slider label="Zoom" value={zoom} min={60} max={180} onChange={setZoom} suffix="%" />
        <Slider label="Rotate 2D" value={rotation} min={-180} max={180} onChange={setRotation} suffix="°" />
        <Slider label="3D tilt up/down" value={tiltX} min={-45} max={45} onChange={setTiltX} suffix="°" />
        <Slider label="3D tilt left/right" value={tiltY} min={-45} max={45} onChange={setTiltY} suffix="°" />
        <Slider label="Brightness" value={brightness} min={50} max={150} onChange={setBrightness} suffix="%" />

        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold">
            <span className="text-[#171524]">Solid background</span>
            <span className="text-black-40">{backgroundColor.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={backgroundColor}
              onChange={(event) => setBackgroundColor(event.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-[#e7e2ee] bg-white p-1"
            />
            <Button
              variant="secondary"
              className="flex-1"
              loading={isRemovingBackground}
              onClick={handleRemoveBackground}
              disabled={backgroundRemoved || isRemovingBackground}
            >
              {backgroundRemoved ? "Background removed" : "Remove original background"}
            </Button>
          </div>
          {!backgroundRemoved && (
            <p className="mt-2 text-xs text-black-40">
              Remove the original background first to replace it cleanly with your chosen color.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button variant="secondary" onClick={reset}>Reset</Button>
          <Button variant="secondary" onClick={onBack}>Back</Button>
        </div>
        <Button className="w-full" onClick={handleDownloadEdited}>Download edited image</Button>
      </div>
    </div>
  );
};
