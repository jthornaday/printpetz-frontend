import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { Loader } from "@/components/ui/loader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useGetStylesQuery } from "@/store/api/styleApi";
import { ECategory, IStyle } from "@/types/style";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";

// Tab order. The catalogue grew from 3 categories to 8 and the tabs were
// rendering in whatever order the rows came back in, which put Sports and
// Professions off the left edge of a 430px sidebar.
//
// Categories are still DERIVED FROM THE DATA, not from this list: a category
// with no styles never gets a tab, so hiding themes stays the job of the
// is_active filter in getStyles. This only decides the order of what survives.
// Anything not listed here sorts to the end rather than disappearing, so a new
// category shows up in the picker the day it is added to the table.
const CATEGORY_ORDER: string[] = [
  "Sports",
  "Professions",
  "Themes",
  "Christmas",
  "Thanksgiving",
  "4th of July",
];

const categoryRank = (category: string) => {
  const index = CATEGORY_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length : index;
};

type ItemProps = {
  name: string;
  image: string;
  isSelected?: boolean;
  onClick: () => void;
};

type StyleContentProps = {
  selectedStyle: IStyle | null;
  setSelectedStyle: Dispatch<SetStateAction<IStyle | null>>;
  searchTerm: string;
};

const StyleItem = ({ name, image, isSelected, onClick }: ItemProps) => (
  <div
    onClick={onClick}
    className={`flex flex-col rounded-lg overflow-hidden transition cursor-pointer border ${
      isSelected ? "border-primary bg-black-90" : "bg-black-80 border-transparent"
    }`}
  >
    {/* Square rather than 4/5. The thumbnails are rendered 1:1, so a taller box
        was letting next/image stretch them — object-cover keeps them honest at
        whatever width the column lands on. */}
    <div className="relative aspect-square w-full">
      <CustomImagePreview image={image} alt={name} className="object-cover" />
    </div>
    <label
      className={`text-xs cursor-pointer font-semibold text-center px-1 py-2 ${
        isSelected ? "text-primary font-bold" : "text-black-30"
      }`}
    >
      {name}
    </label>
  </div>
);

export const StyleContent = ({
  selectedStyle,
  setSelectedStyle,
  searchTerm,
}: StyleContentProps) => {
  const { data: styles, isFetching } = useGetStylesQuery({});

  const filteredStyles = useMemo(
    () =>
      styles?.filter((style) => style.name.toLowerCase().includes(searchTerm.toLowerCase())) || [],
    [styles, searchTerm]
  );

  const categories = useMemo(() => {
    if (!styles) return [] as ECategory[];

    const seen = Array.from(new Set(styles.map((style) => style.category)));
    return seen.sort((a, b) => categoryRank(a) - categoryRank(b));
  }, [styles]);

  useEffect(() => {
    if (!styles) return;

    if (!selectedStyle && styles[0]) {
      setSelectedStyle(styles[0]);
    }
  }, [styles, selectedStyle, setSelectedStyle]);

  if (isFetching || !categories.length) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <Tabs defaultValue={categories[0]} className="h-full gap-1.5">
      {/* Wraps to as many rows as it takes. flex-none on the trigger undoes the
          flex-1 in the base component: equal-width tabs stretched to fill one
          line is exactly what pushed the later categories off-screen. */}
      <TabsList className="flex w-full flex-wrap justify-start gap-x-1">
        {categories.map((category) => (
          <TabsTrigger
            key={category}
            value={category}
            className="h-auto flex-none gap-1 items-start"
          >
            {category}
            <span
              className={`w-1 h-1 rounded-full bg-orange ${
                selectedStyle?.category === category ? "opacity-100" : "opacity-0"
              } `}
            />
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => {
        const categoryStyles = filteredStyles?.filter((s) => s.category === category);

        return (
          <TabsContent key={category} value={category} className="overflow-auto p-1">
            {categoryStyles?.length ? (
              // Two up on mobile; from md the columns size themselves so a card
              // lands near 200px wide. In the 430px create-page sidebar that is
              // two columns, and the full-width layout below xl gets four or
              // more from the same rule.
              <div className="grid grid-cols-2 gap-3 md:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
                {categoryStyles.map((style) => (
                  <StyleItem
                    key={style.id}
                    name={style.name}
                    image={style.image}
                    isSelected={selectedStyle?.id === style.id}
                    onClick={() => setSelectedStyle(style)}
                  />
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-secondary text-sm py-40">
                No styles found
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};
