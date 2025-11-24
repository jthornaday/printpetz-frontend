import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { Loader } from "@/components/ui/loader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useGetStylesQuery } from "@/store/api/styleApi";
import { ECategory, IStyle } from "@/types/style";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type ItemProps = {
  name: string;
  image: string;
  isSelected?: boolean;
  onClick: () => void;
};

type StyleContentProps = {
  selectedStyle: IStyle | null;
  setSelectedStyle: Dispatch<SetStateAction<IStyle | null>>;
};

const StyleItem = ({ name, image, isSelected, onClick }: ItemProps) => (
  <div
    onClick={onClick}
    className={`flex flex-col aspect-[4/5] rounded-lg overflow-hidden transition cursor-pointer border ${
      isSelected ? "border-primary bg-black-90" : "bg-black-80 border-transparent"
    }`}
  >
    <div className="relative flex-grow">
      <CustomImagePreview image={image} />
    </div>
    <label
      className={`text-xs cursor-pointer font-semibold text-center px-1 py-2 ${
        isSelected ? "text-white font-bold" : "text-black-30"
      }`}
    >
      {name}
    </label>
  </div>
);

export const StyleContent = ({ selectedStyle, setSelectedStyle }: StyleContentProps) => {
  const [categories, setCategories] = useState<ECategory[]>([]);

  const { data: styles, isFetching } = useGetStylesQuery({});

  useEffect(() => {
    if (!styles) return;

    const cats = styles?.reduce((acc: ECategory[], curr) => {
      if (acc.includes(curr.category)) {
        return acc;
      }
      acc.push(curr.category);
      return acc;
    }, [] as ECategory[]);

    setCategories(cats);

    if (!selectedStyle && styles[0]) {
      setSelectedStyle(styles[0]);
    }
  }, [styles]);

  if (isFetching || !categories.length) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <Tabs defaultValue={categories[0]} className="overflow-auto">
      <TabsList className="w-full">
        {categories.map((category) => (
          <TabsTrigger key={category} value={category} className="gap-1 items-start">
            {category}
            <span
              className={`w-1 h-1 rounded-full bg-orange ${
                selectedStyle?.category === category ? "opacity-100" : "opacity-0"
              } `}
            />
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category} value={category} className="overflow-auto p-1">
          <div className="grid grid-cols-3 gap-1.5">
            {styles
              ?.filter((s) => s.category === category)
              .map((style) => (
                <StyleItem
                  key={style.id}
                  name={style.name}
                  image={style.image}
                  isSelected={selectedStyle?.id === style.id}
                  onClick={() => setSelectedStyle(style)}
                />
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
