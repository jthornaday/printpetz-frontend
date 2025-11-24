export type IconProps = {
  size?: number;
} & Omit<React.SVGProps<SVGSVGElement>, "width" | "height" | "size">;

type ObjectFit = "horizontal-cover" | "vertical-cover" | "auto-cover" | "contain";

export type ImageMetadata = {
  name: string;
  src: string;
  // objectFit: ObjectFit;
  // aspectRatio: string;
  // size: { width: number; height: number };
};
