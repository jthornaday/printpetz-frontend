import { IconProps } from "@/types/common";

export const LogoutIcon = ({ size = 24, ...props }: IconProps) => {
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
        d="M12 2H7C4.79086 2 3 3.79086 3 6V18C3 20.2091 4.79086 22 7 22H12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M19 15L21.2929 12.7071C21.6834 12.3166 21.6834 11.6834 21.2929 11.2929L19 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M21 12L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
};
