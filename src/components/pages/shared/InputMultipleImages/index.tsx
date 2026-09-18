import { UploadImageIcon } from "@/components/icons";
import { useRef } from "react";

type Props = {
  onFiles: (files: File[]) => void;
  isSmall?: boolean;
};

// Click-to-browse only. Drops are handled for the whole page by
// useWindowFileDrop, so this deliberately has no onDrop: a second handler here
// would add every dropped file twice.
export const InputMultipleImages = ({ onFiles, isSmall = false }: Props) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  return (
    // Fills the nearest positioned ancestor rather than relying on a percentage
    // height, which only resolves when every ancestor's height is definite.
    <div className="absolute inset-0 flex items-center justify-center">
      <input
        multiple
        type="file"
        accept=".jpg, .jpeg, .png, .heic, .heif"
        className="hidden"
        ref={imageInputRef}
        // Copy before the reset below: the FileList is live.
        onChange={(e) => onFiles(Array.from(e.target.files ?? []))}
        onClick={(e) => ((e.target as HTMLInputElement).value = "")}
      />

      <div
        onClick={() => imageInputRef.current?.click()}
        className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-5 text-black-50"
      >
        <UploadImageIcon size={26} />
        {!isSmall && (
          <div className="text-center text-sm font-bold">Drag & Drop Files or Upload</div>
        )}
      </div>
    </div>
  );
};
