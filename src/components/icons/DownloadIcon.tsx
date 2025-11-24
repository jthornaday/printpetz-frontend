import { IconProps } from "@/types/common";

export const DownloadIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M22 14L22 17C22 19.2091 20.2091 21 18 21L6 21C3.79086 21 2 19.2091 2 17L2 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9 13L11.2929 15.2929C11.6834 15.6834 12.3166 15.6834 12.7071 15.2929L15 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M12 15L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};
