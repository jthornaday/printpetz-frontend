import { HistoryIcon, MagicSparkIcon } from "@/components/icons";
import { ROUTES } from "@/routes";
import { useRouter } from "next/router";

const navbarOptions = [
  {
    name: "Create",
    path: ROUTES.create,
    icon: <MagicSparkIcon />,
  },
  {
    name: "History",
    path: ROUTES.history,
    icon: <HistoryIcon />,
  },
];

// Sidebar Navigation
export const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="border-r border-[#e7e2ee] bg-white flex flex-col items-center p-4 gap-4 lg:gap-5">
      {navbarOptions.map((option, index) => {
        const isCurrent = option.path === router.pathname;
        return (
          <div
            key={index}
            className={`lg:w-19 p-2.5 flex flex-col items-center gap-2 rounded-lg transition ${
              isCurrent
                ? "text-primary bg-[#f0ecff]"
                : "text-black-40 cursor-pointer hover:bg-black-90"
            }`}
            onClick={() => !isCurrent && router.push(option.path)}
          >
            {option.icon}
            <span
              className={`font-semibold text-sm hidden lg:block ${isCurrent ? "font-bold" : ""}`}
            >
              {option.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};
