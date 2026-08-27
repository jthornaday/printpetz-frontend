import { LayersIcon, SearchIcon } from "@/components/icons";
import { IStyle } from "@/types/style";
import { Dispatch, SetStateAction, useState } from "react";
import { StyleContent } from "./components/StyleContent";
import { Input } from "@/components/ui/input";

type Props = {
  selectedStyle: IStyle | null;
  setSelectedStyle: Dispatch<SetStateAction<IStyle | null>>;
};

// Style Selector Component
export const StyleSelector = ({ selectedStyle, setSelectedStyle }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="h-full max-h-[600px] bg-black-90 rounded-lg p-1 flex flex-col">
      <div className="flex gap-4 items-center p-3">
        <LayersIcon size={20} />
        <span className="font-bold">Style</span>
      </div>

      <div className="px-2 py-0.5 bg-black-80 flex items-center gap-2.5 rounded-lg mx-3 my-3">
        <SearchIcon size={20} className="text-black-30" />
        <Input
          type="text"
          placeholder="Search style"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-0 h-8 text-sm text-[#171524] font-semibold rounded-lg focus-visible:ring-0 focus-visible:border-transparent"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <StyleContent
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
};
