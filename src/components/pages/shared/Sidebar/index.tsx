import { HistoryIcon, MagicSparkIcon } from "@/components/icons";
import { ROUTES } from "@/routes";
import { shopEnabled } from "@/utils/shopMode";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const navbarOptions = [
  {
    name: "Create",
    path: ROUTES.create,
    icon: <MagicSparkIcon />,
  },
  {
    name: "Gallery",
    path: ROUTES.history,
    icon: <HistoryIcon />,
  },
];

const shopOption = {
  name: "Shop",
  path: ROUTES.shop,
  icon: <ShoppingBag size={24} />,
};

// Sidebar Navigation
export const Sidebar = () => {
  const router = useRouter();
  const [showShop, setShowShop] = useState(false);
  useEffect(() => setShowShop(shopEnabled()), []);
  const options = showShop ? [...navbarOptions, shopOption] : navbarOptions;

  return (
    <div className="border-r border-[#e7e2ee] bg-white flex flex-col items-center p-2 sm:p-4 gap-4 lg:gap-5">
      {options.map((option, index) => {
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
