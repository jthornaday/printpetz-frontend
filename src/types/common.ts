export type IconProps = {
  size?: number;
} & Omit<React.SVGProps<SVGSVGElement>, "width" | "height" | "size">;

type ObjectFit = "horizontal-cover" | "vertical-cover" | "auto-cover" | "contain";

export type ImageMetadata = {
  name: string;
  src: string;
  // HEIC is accepted (the server converts it) but most browsers cannot draw
  // it, so the grid falls back to a placeholder tile when the browser refuses it.
  isHeic?: boolean;
  // objectFit: ObjectFit;
  // aspectRatio: string;
  // size: { width: number; height: number };
};
