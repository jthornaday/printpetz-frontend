import { IconProps } from "@/types/common";

export const ShareIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="17.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="5.5" cy="11.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M15 6L8 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 13.5L15 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="17.5" cy="19.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
};
