import { IconProps } from "@/types/common";

export const ErrorIcon = ({ size = 24, ...props }: IconProps) => {
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
        d="M12 9V14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.0001 18.01L12.0101 17.9989"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.26001 3.83001L2.20001 15.65C1.12001 17.45 1.43001 19.86 2.92001 21.31C3.89001 22.25 5.16001 22.75 6.47001 22.75H17.53C18.84 22.75 20.11 22.25 21.08 21.31C22.57 19.86 22.88 17.44 21.8 15.65L14.74 3.83001C13.51 1.78001 10.49 1.78001 9.26001 3.83001Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
