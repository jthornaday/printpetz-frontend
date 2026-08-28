import { ScreenIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

type Props = {
  numberOfGenerations: number;
  setNumberOfGenerations: Dispatch<SetStateAction<number>>;
  cutenessLevel: number;
  setCutenessLevel: Dispatch<SetStateAction<number>>;
};

const cutenessLabels: Record<number, string> = {
  1: "Natural",
  2: "Cute",
  3: "Extra Cute",
  4: "Super Cute",
  5: "Stop It, Cute!",
};

// Generation Controls Component
export const GenerationControls = ({
  numberOfGenerations,
  setNumberOfGenerations,
  cutenessLevel,
  setCutenessLevel,
}: Props) => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-black-90 p-4">
      <div className="flex items-center justify-between">
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
          <span className="text-[#171524] font-semibold w-3 text-center">{numberOfGenerations}</span>
          <Button
            variant={"link"}
            onClick={() => setNumberOfGenerations((pre) => Math.min(4, pre + 1))}
            className="min-h-5 h-6 w-6 p-1 text-black-30 hover:text-black-10 transition cursor-pointer text-xl"
          >
            +
          </Button>
        </div>
      </div>

      <div className="border-t border-black-70 pt-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold">Cuteness</p>
            <p className="text-xs text-black-40">Choose how mascot-like your pet should look.</p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            {cutenessLabels[cutenessLevel]}
          </span>
        </div>

        <input
          aria-label="Cuteness level"
          type="range"
          min={1}
          max={5}
          step={1}
          value={cutenessLevel}
          onChange={(event) => setCutenessLevel(Number(event.target.value))}
          className="w-full cursor-pointer accent-primary"
        />
        <div className="mt-1 grid grid-cols-5 gap-1 text-center text-[10px] font-medium text-black-40">
          <span>Natural</span>
          <span>Cute</span>
          <span>Extra Cute</span>
          <span>Super Cute</span>
          <span>Stop It, Cute!</span>
        </div>
      </div>
    </div>
  );
};
