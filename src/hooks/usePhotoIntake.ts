import { Dispatch, SetStateAction, useCallback, useEffect, useRef } from "react";
import { useToast } from "@/hooks/useToast";
import { readPhotoFiles } from "@/services/shared/image";
import { ImageMetadata } from "@/types/common";
import { EToastType } from "@/types/toast";
import { appConstants } from "@/utils/constants/appConstants";

const { max } = appConstants.modelTraining.imageSelectionLimit;

const list = (names: string[]) => names.join(", ");
const verb = (names: string[]) => (names.length > 1 ? "are" : "is");

/**
 * Add a batch of files to the selected photos: every valid file is added, and
 * every file that is not (HEIC, wrong type, unreadable, over the cap) is named
 * in one toast. The toast provider keeps a single toast at a time, so separate
 * toasts per reason would overwrite each other.
 */
export const usePhotoIntake = (
  selectedCount: number,
  setSelectedImages: Dispatch<SetStateAction<ImageMetadata[]>>
) => {
  const { toast } = useToast();
  const countRef = useRef(selectedCount);
  useEffect(() => {
    countRef.current = selectedCount;
  }, [selectedCount]);

  return useCallback(
    async (files: File[]) => {
      if (!files.length) return;

      const { images, heic, unsupported, unreadable } = await readPhotoFiles(files);

      const slots = Math.max(0, max - countRef.current);
      const toAdd = images.slice(0, slots);
      countRef.current += toAdd.length;
      if (toAdd.length) {
        setSelectedImages((prev) => prev.concat(toAdd.slice(0, Math.max(0, max - prev.length))));
      }

      const problems: string[] = [];
      if (heic.length) {
        problems.push(
          `${list(heic)} ${verb(heic)} in Apple's HEIC format, which we can't read. Please use a ` +
            "JPEG or PNG instead (iPhone: Settings > Camera > Formats > Most Compatible)."
        );
      }
      if (unsupported.length) {
        problems.push(`${list(unsupported)} ${verb(unsupported)}n't a JPEG, PNG or WebP image.`);
      }
      if (unreadable.length) {
        problems.push(`${list(unreadable)} couldn't be read. Try adding ${unreadable.length > 1 ? "them" : "it"} again.`);
      }
      const skipped = images.length - toAdd.length;
      if (skipped > 0) {
        problems.push(`You can use up to ${max} photos, so ${skipped} weren't added.`);
      }
      if (problems.length) toast(EToastType.ERROR, problems.join(" "));
    },
    [setSelectedImages, toast]
  );
};
