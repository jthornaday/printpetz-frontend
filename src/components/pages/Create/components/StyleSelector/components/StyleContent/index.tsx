import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { Loader } from "@/components/ui/loader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useGetStylesQuery } from "@/store/api/styleApi";
import { IStyle } from "@/types/style";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";

// Tab order and display labels.
//
// The table does not spell its categories the way the picker does: the
// original 24 themes are filed under 'Profession' (singular) and 'themes'
// (lowercase), while the 47 expansion themes use 'Christmas', 'Historical' and
// so on. Matching those raw strings against a hardcoded list is what sorted
// two real categories to the end of the tab row under labels nobody
// recognised. Everything below therefore keys off a case-insensitive lookup,
// and the tab shows the canonical label rather than whatever the row says.
const CATEGORY_LABELS: Record<string, string> = {
  sports: "Sports",
  profession: "Professions",
  professions: "Professions",
  theme: "Themes",
  themes: "Themes",
  christmas: "Christmas",
  thanksgiving: "Thanksgiving",
  "4th of july": "4th of July",
  historical: "Historical",
  heroes: "Heroes",
};

const CATEGORY_ORDER: string[] = [
  "Sports",
  "Professions",
  "Themes",
  "Christmas",
  "Thanksgiving",
  "4th of July",
];

// An unrecognised category keeps its raw name rather than being swallowed, so
// a value added to the table shows up in the picker the same day -- misspelled
// if need be, but visible and clickable.
const categoryLabel = (category: string) =>
  CATEGORY_LABELS[category?.trim().toLowerCase() ?? ""] ?? category;

const categoryRank = (label: string) => {
  const index = CATEGORY_ORDER.indexOf(label);
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

  // Tabs are keyed by the display label, so 'Profession' and a future
  // 'Professions' collapse into one tab instead of two half-full ones.
  const categories = useMemo(() => {
    if (!styles) return [] as string[];

    const seen = Array.from(new Set(styles.map((style) => categoryLabel(style.category))));
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
                selectedStyle && categoryLabel(selectedStyle.category) === category
                  ? "opacity-100"
                  : "opacity-0"
              } `}
            />
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => {
        const categoryStyles = filteredStyles?.filter(
          (s) => categoryLabel(s.category) === category
        );

        return (
          <TabsContent key={category} value={category} className="overflow-auto p-1">
            {categoryStyles?.length ? (
              // Two up on mobile; from md the columns size themselves so a card
              // is never narrower than 240px. Beside the pet panel on xl that is
              // two to four columns depending on screen width.
              <div className="grid grid-cols-2 gap-4 md:[grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
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
