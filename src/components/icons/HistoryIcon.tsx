import { IconProps } from "@/types/common";

export const HistoryIcon = ({ size = 24, ...props }: IconProps) => {
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
        d="M12 7.45459V12L14.7273 14.7273"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12C2 14.352 2.829 16.6286 4.34128 18.4299C5.85357 20.2312 7.95238 21.4418 10.2688 21.849C12.5853 22.2562 14.9711 21.8338 17.007 20.6562C19.0429 19.4786 20.5986 17.6211 21.4006 15.4101C22.2026 13.1991 22.1997 10.7762 21.3923 8.56716C20.5849 6.35813 19.0248 4.50437 16.986 3.33169C14.9473 2.159 12.5604 1.74244 10.245 2.15521C7.92953 2.56798 5.83366 3.78368 4.32574 5.58863"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M3.81836 2V4.72727C3.81836 5.73143 4.63239 6.54545 5.63654 6.54545H8.36381"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
