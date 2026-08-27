import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes";
import { useRouter } from "next/router";

const PageNotFound = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 gap-3">
      <h1 className="text-6xl font-bold text-[#171524]">404</h1>
      <h2 className="text-2xl font-semibold text-[#716a7c]">{"Page Not Found"}</h2>
      <Button className="w-fit mt-5 px-8" onClick={() => router.push(ROUTES.create)}>
        Go Back
      </Button>
    </div>
  );
};

export default PageNotFound;
