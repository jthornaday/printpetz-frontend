import { useMemo } from "react";
import { useRouter } from "next/router";

import { ROUTES } from "@/routes";
import { cn } from "@/lib/utils";
import { publicRoutes, protectedRoutes } from "@/utils/constants/appConstants";
import { AnimatedImageSlider } from "../shared/AnimatedImageSlider";
import { Header } from "../pages/shared/Header";
import { Sidebar } from "../pages/shared/Sidebar";
import { ModelTrainingDialog } from "../pages/shared/ModelTrainingDialog";

type PageWrapperProps = { children: React.ReactNode } & React.ComponentProps<"div">;

type LayoutVariant = "landing" | "auth" | "protected" | "default";

const AUTH_SLIDER_ROUTES = [...publicRoutes, ROUTES.resetPassword];

const resolveLayout = (pathname: string): LayoutVariant => {
  if (pathname === ROUTES.landing) return "landing";
  if (AUTH_SLIDER_ROUTES.includes(pathname)) return "auth";
  if (protectedRoutes.includes(pathname)) return "protected";
  return "default";
};

const Shell = ({ children, className }: PageWrapperProps) => (
  <div className="min-h-screen overflow-hidden bg-[#fcfbff] text-[#171524]">
    <div className={cn("h-screen min-h-[850px]", className)}>{children}</div>
  </div>
);

const LAYOUT_MAP: Record<LayoutVariant, React.FC<{ children: React.ReactNode }>> = {
  landing: ({ children }) => <Shell className="overflow-y-auto">{children}</Shell>,

  auth: ({ children }) => (
    <Shell className="flex">
      {children}
      <AnimatedImageSlider />
    </Shell>
  ),

  protected: ({ children }) => (
    <Shell className="flex flex-col">
      <Header />
      <div className="flex flex-1 min-w-0 overflow-auto">
        <Sidebar />
        {children}
      </div>

      <ModelTrainingDialog />
    </Shell>
  ),

  default: ({ children }) => <Shell>{children}</Shell>,
};

export const PageWrapper = ({ children }: PageWrapperProps) => {
  const { pathname } = useRouter();
  const layout = useMemo(() => resolveLayout(pathname), [pathname]);

  const Layout = LAYOUT_MAP[layout];
  return <Layout>{children}</Layout>;
};
