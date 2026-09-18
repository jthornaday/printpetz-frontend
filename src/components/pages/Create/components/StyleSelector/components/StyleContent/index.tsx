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
  <button type="button" onClick={onClick} aria-pressed={!!isSelected} className="studio-theme-card">
    <span className="relative block aspect-square w-full"><CustomImagePreview image={image} alt={name} className="object-cover"/></span>
    <span className="studio-theme-card-caption"><span>{name}</span>{isSelected && <span aria-hidden="true">✓</span>}</span>
  </button>
);

export const StyleContent = ({
  selectedStyle,
  setSelectedStyle,
  searchTerm,
}: StyleContentProps) => {
  const { data: styles, isLoading, isError, refetch } = useGetStylesQuery({});

  const filteredStyles = useMemo(
    () =>
      styles?.filter((style) => style.name.toLowerCase().includes(searchTerm.trim().toLowerCase())) || [],
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

  if (isLoading) return <div className="studio-empty" role="status"><Loader/><p>Loading the theme collection…</p></div>;
  if (isError) return <div className="studio-empty" role="alert">We couldn’t load the themes.<button type="button" onClick={() => refetch()}>Try again</button></div>;
  if (!styles?.length) return <div className="studio-empty">No themes are available yet. Please check back soon.</div>;

  const renderCards = (items: IStyle[]) => items.length ? <div className="studio-theme-grid">{items.map(style => <StyleItem key={style.id} name={style.name} image={style.image} isSelected={selectedStyle?.id === style.id} onClick={() => setSelectedStyle(style)}/>)}</div> : <p className="studio-empty">No themes match your search. Try another word.</p>;

  // Search the entire collection, including categories that are not active.
  if (searchTerm.trim()) return <div><p role="status" className="studio-search-count">{filteredStyles.length} matching theme{filteredStyles.length === 1 ? "" : "s"} across all categories</p>{renderCards(filteredStyles)}</div>;

  return <Tabs defaultValue={categories[0]} className="gap-2"><TabsList className="flex w-full flex-wrap justify-start">{categories.map(category => <TabsTrigger key={category} value={category} className="flex-none">{category}</TabsTrigger>)}</TabsList>{categories.map(category => <TabsContent key={category} value={category}>{renderCards(styles.filter(s => categoryLabel(s.category) === category))}</TabsContent>)}</Tabs>;
};
