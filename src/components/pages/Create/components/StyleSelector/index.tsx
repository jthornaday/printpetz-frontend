import { SearchIcon } from "@/components/icons";
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
    <div className="studio-theme-picker">
      <div className="studio-theme-search">
        <SearchIcon size={20}/>
        <Input type="search" aria-label="Search all themes" placeholder="Search all themes — astronaut, baseball, royalty…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-11 min-w-0 flex-1 border-0 bg-transparent text-sm focus-visible:ring-0"/>
      </div>
      <StyleContent selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle} searchTerm={searchTerm}/>
    </div>
  );
};
