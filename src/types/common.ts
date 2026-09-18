export type IconProps = {
  size?: number;
} & Omit<React.SVGProps<SVGSVGElement>, "width" | "height" | "size">;

type ObjectFit = "horizontal-cover" | "vertical-cover" | "auto-cover" | "contain";

export type ImageMetadata = {
  name: string;
  src: string;
  // HEIC is accepted (the server converts it) but most browsers cannot draw
  // it, so the grid shows a placeholder tile instead of a blank thumbnail.
  isHeic?: boolean;
  // objectFit: ObjectFit;
  // aspectRatio: string;
  // size: { width: number; height: number };
};
