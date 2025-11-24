import { HistoryIcon, MagicSparkIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes";
import { useRouter } from "next/router";

export const NoHistory = () => {
  const router = useRouter();

  return (
    <div className="w-sm flex flex-col items-center gap-8">
      <HistoryIcon size={46} />
      <div className="text-center">
        <h3 className="font-bold text-white">Your creation History will appear here</h3>
        <p className="text-sm text-black-40">Start creating amazing images of your Pet</p>
      </div>
      <Button className="w-fit" onClick={() => router.push(ROUTES.create)}>
        <MagicSparkIcon />
        Let`s Start Creating
      </Button>
    </div>
  );
};
