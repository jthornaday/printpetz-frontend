import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SearchIcon } from "@/components/icons";

type SearchInputProps = {
  placeholder?: string;
  className?: string;
  inputClass?: string;
  onSearch: (value: string | undefined) => void;
  startIcon?: React.ReactNode;
};

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder = "Search...", className, onSearch, inputClass }, ref) => {
    const [value, setValue] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(value.trim() || undefined);
    };

    return (
      <form onSubmit={handleSubmit} className={cn("w-full flex items-center", className)}>
        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2">
            <SearchIcon size={20} aria-hidden="true" />
          </span>
          <Input
            ref={ref}
            type="text"
            inputMode="search"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={cn(
              "text-base flex-1 pl-12 !bg-grey-10 text-primary placeholder:text-grey-30 font-semibold border-grey-20 rounded-xl",
              inputClass
            )}
          />
        </div>
      </form>
    );
  }
);

SearchInput.displayName = "SearchInput";
