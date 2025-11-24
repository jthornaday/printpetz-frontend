import React from "react";
import { Button } from "@/components/ui/button";
import { FileSearch } from "lucide-react";

interface NoDataFoundProps {
  title?: string;
  description?: string;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

const NoDataFound: React.FC<NoDataFoundProps> = ({
  title = "No Data Found",
  description = "We couldn't find any data to display right now.",
  showButton = false,
  buttonText = "Retry",
  onButtonClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 h-full">
      <div className="bg-gray-100 p-6 rounded-full mb-4 shadow-lg">
        <FileSearch className="w-12 h-12 text-gray-500" />
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-500 mt-2 max-w-md">{description}</p>
      {showButton && (
        <Button onClick={onButtonClick} className="mt-4">
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default NoDataFound;
