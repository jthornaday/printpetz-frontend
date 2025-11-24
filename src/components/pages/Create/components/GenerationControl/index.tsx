import { ScreenIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

type Props = {
  numberOfGenerations: number;
  setNumberOfGenerations: Dispatch<SetStateAction<number>>;
};

// Generation Controls Component
export const GenerationControls = ({ numberOfGenerations, setNumberOfGenerations }: Props) => {
  return (
    <div className="w-full bg-black-90 p-4 rounded-lg flex items-center justify-between">
      <div className="flex gap-4 items-center">
        <ScreenIcon size={20} />
        <span className="font-bold">No. of Generations</span>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant={"link"}
          onClick={() => setNumberOfGenerations((pre) => Math.max(1, pre - 1))}
          className="min-h-5 h-6 w-6 p-1 text-black-30 hover:text-black-10 transition cursor-pointer text-xl"
        >
          -
        </Button>
        <span className="text-white font-semibold w-3 text-center">{numberOfGenerations}</span>
        <Button
          variant={"link"}
          onClick={() => setNumberOfGenerations((pre) => Math.min(4, pre + 1))}
          className="min-h-5 h-6 w-6 p-1 text-black-30 hover:text-black-10 transition cursor-pointer text-xl"
        >
          +
        </Button>
      </div>
    </div>
  );
};
