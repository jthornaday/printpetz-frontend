import { IconProps } from "@/types/common";

export const LoadingIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <style>
        {`
          @keyframes loaderFade {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
          .loader-line-1 { animation: loaderFade 1.4s ease-in-out infinite; animation-delay: 0s; }
          .loader-line-2 { animation: loaderFade 1.4s ease-in-out infinite; animation-delay: 0.175s; }
          .loader-line-3 { animation: loaderFade 1.4s ease-in-out infinite; animation-delay: 0.35s; }
          .loader-line-4 { animation: loaderFade 1.4s ease-in-out infinite; animation-delay: 0.525s; }
          .loader-line-5 { animation: loaderFade 1.4s ease-in-out infinite; animation-delay: 0.7s; }
          .loader-line-6 { animation: loaderFade 1.4s ease-in-out infinite; animation-delay: 0.875s; }
          .loader-line-7 { animation: loaderFade 1.4s ease-in-out infinite; animation-delay: 1.05s; }
          .loader-line-8 { animation: loaderFade 1.4s ease-in-out infinite; animation-delay: 1.225s; }
        `}
      </style>
      <path
        className="loader-line-1"
        d="M12 2L12 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="loader-line-2"
        d="M19.0711 4.92891L16.9498 7.05023"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="loader-line-3"
        d="M22 12L19 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="loader-line-4"
        d="M16.9497 16.95L19.071 19.0713"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="loader-line-5"
        d="M12 19L12 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="loader-line-6"
        d="M7.05028 16.95L4.92896 19.0713"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="loader-line-7"
        d="M5 12L2 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="loader-line-8"
        d="M4.92897 4.92891L7.05029 7.05023"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
