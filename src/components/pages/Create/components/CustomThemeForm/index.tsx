import { ChangeEvent, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { useUploadFileMutation } from "@/store/api/fileApi";
import { useToast } from "@/hooks/useToast";
import { EToastType } from "@/types/toast";
import { EUploadFile } from "@/types/file";

export const CUSTOM_DESCRIPTION_MIN = 3;
export const CUSTOM_DESCRIPTION_MAX = 300;

type Props = {
  description: string;
  setDescription: (value: string) => void;
  referencePhotoUrl: string | null;
  setReferencePhotoUrl: (url: string | null) => void;
  error: string | null;
  disabled?: boolean;
};

export const CustomThemeForm = ({
  description,
  setDescription,
  referencePhotoUrl,
  setReferencePhotoUrl,
  error,
  disabled,
}: Props) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const length = description.trim().length;
  const isInvalid = length > 0 && (length < CUSTOM_DESCRIPTION_MIN || length > CUSTOM_DESCRIPTION_MAX);

  const handlePhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const result = await uploadFile({ files: [file], type: EUploadFile.CUSTOM_REFERENCE }).unwrap();
      const url = result.data?.fileUrls?.[0];
      if (!url) throw new Error("No URL returned");
      setReferencePhotoUrl(url);
    } catch {
      toast(EToastType.ERROR, "Failed to upload photo");
    }
  };

  return (
    <div className="studio-custom-theme mt-8 border-t border-black-70 pt-6">
      <p className="studio-eyebrow">OR MAKE YOUR OWN</p>
      <h3 className="text-lg font-bold">Create Your Own Template</h3>
      <p className="mt-1 text-sm text-black-40">Describe the scene you want. A reference photo is optional.</p>
      <textarea
        aria-label="Describe your custom scene"
        aria-invalid={isInvalid || !!error}
        rows={3}
        maxLength={CUSTOM_DESCRIPTION_MAX + 50}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={disabled}
        placeholder="e.g. a knight riding a dragon over a castle at sunset"
        className="mt-3 w-full rounded-xl border border-black-70 p-3 text-sm"
      />
      <div className="mt-1 flex justify-between text-xs">
        <span className={isInvalid ? "text-red-600" : "text-black-40"}>
          {isInvalid
            ? `Description must be ${CUSTOM_DESCRIPTION_MIN}-${CUSTOM_DESCRIPTION_MAX} characters`
            : `${CUSTOM_DESCRIPTION_MIN}-${CUSTOM_DESCRIPTION_MAX} characters`}
        </span>
        <span className={isInvalid ? "text-red-600" : "text-black-40"}>
          {length}/{CUSTOM_DESCRIPTION_MAX}
        </span>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="mt-3 flex items-center gap-3">
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
        <button
          type="button"
          className="studio-create-pet-button"
          disabled={disabled || isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus size={17} />
          {isUploading ? "Uploading…" : referencePhotoUrl ? "Replace reference photo" : "Add reference photo (optional)"}
        </button>
        {referencePhotoUrl && (
          <button type="button" aria-label="Remove reference photo" onClick={() => setReferencePhotoUrl(null)}>
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
