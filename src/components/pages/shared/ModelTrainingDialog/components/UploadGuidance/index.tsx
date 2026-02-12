import { FilledCheckIcon, FilledCloseIcon } from "@/components/icons";
import { CustomImagePreview } from "@/components/shared/CustomImagePreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import highQuality from "@/utils/images/modelTraining/high-quality.png";
import varietyOfLighting from "@/utils/images/modelTraining/variety-of-lighting.png";
import varietyOfAngles from "@/utils/images/modelTraining/variety-of-angles.png";
import varietyOfLocations from "@/utils/images/modelTraining/variety-of-locations.png";
import blurry from "@/utils/images/modelTraining/blurry.png";
import multiplePets from "@/utils/images/modelTraining/multiple-pets.png";
import farAway from "@/utils/images/modelTraining/far-away.png";
import withPeople from "@/utils/images/modelTraining/with-people.png";
import { StaticImageData } from "next/image";

type PhotoWithName = {
  name: string;
  image: StaticImageData;
};

const PhotosToUseList: PhotoWithName[] = [
  { name: "High Quality", image: highQuality },
  { name: "Variety of Lighting", image: varietyOfLighting },
  { name: "Variety of Angles", image: varietyOfAngles },
  { name: "Variety of Locations", image: varietyOfLocations },
];
const PhotosToAvoidList: PhotoWithName[] = [
  { name: "Blurry", image: blurry },
  { name: "Multiple Pets", image: multiplePets },
  { name: "Far Away", image: farAway },
  { name: "With People", image: withPeople },
];

type Props = { isCorrect: boolean };

const ExampleItem = ({ photoWithName }: { photoWithName: PhotoWithName }) => {
  return (
    <div className="flex flex-col aspect-[4/5] bg-black-80 rounded-lg overflow-hidden">
      <div className="relative flex-grow">
        <CustomImagePreview image={photoWithName.image} />
      </div>
      <label className="text-xs cursor-pointer font-semibold text-center px- py-2 text-white">
        {photoWithName.name}
      </label>
    </div>
  );
};

const UploadExamples = ({ isCorrect }: Props) => {
  const title = isCorrect ? "Photos to use" : "Photos to avoid";
  const Icon = isCorrect ? FilledCheckIcon : FilledCloseIcon;
  const photos = isCorrect ? PhotosToUseList : PhotosToAvoidList;

  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={`flex gap-2 font-bold text-sm items-center ${
            isCorrect ? "text-green" : "text-red"
          }`}
        >
          <Icon size={20} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-1.5">
        {photos.map((item, i) => (
          <ExampleItem key={i} photoWithName={item} />
        ))}
      </CardContent>
    </Card>
  );
};

export const UploadGuidance = () => {
  return (
    <div className="w-xs bg-black-100 border-r-[1px] border-black-70 overflow-auto h-full">
      <p className="text-black-50 font-bold text-sm sticky top-0 bg-black-100 p-4 z-1">
        Upload Guidance
      </p>
      <div className="flex flex-col gap-2 px-4 pb-4 overflow-auto">
        <UploadExamples isCorrect />
        <UploadExamples isCorrect={false} />
      </div>
    </div>
  );
};
