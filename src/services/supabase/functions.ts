import { appConstants } from "@/utils/constants/appConstants";
import { supabase } from "./client";

export const uploadFileToStorage = async (
  blob: Blob,
  filePath: string
): Promise<{ url: string | null; error: any }> => {
  const bucket = appConstants.storage.bucket;

  try {
    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, blob, {
      cacheControl: "3600",
      upsert: true,
    });

    if (uploadError) {
      return { url: null, error: uploadError };
    }

    const { data: publicURL } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return { url: publicURL.publicUrl, error: null };
  } catch (e) {
    return { url: null, error: e };
  }
};
