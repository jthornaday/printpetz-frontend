import { IconProps } from "@/types/common";

export const ArrowIcon = ({ size = 24, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7.99985 16L4.70696 12.7071C4.31643 12.3166 4.31643 11.6834 4.70696 11.2929L7.99985 8M4.99985 12L18.9998 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
