import { ImageMetadata } from "@/types/common";

export const handleGetImageMetadata = async (files: File[]): Promise<ImageMetadata[]> => {
  // keep only valid image MIME types
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));

  return Promise.all(
    imageFiles.map(
      (file) =>
        new Promise<ImageMetadata>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ name: file.name, src: reader.result as string });
          reader.onerror = () => reject("Failed to read file");
          reader.readAsDataURL(file);
        })
    )
  );
};

// Sniff the bytes rather than trust the name: a renamed .jpg can still be HEIC
// inside, and Chrome/Windows hands over HEIC with an empty type.
export const isHeicFile = async (file: File): Promise<boolean> => {
  if (/\.(heic|heif)$/i.test(file.name) || /^image\/hei[cf]/i.test(file.type)) return true;
  try {
    const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const ascii = (from: number, to: number) => String.fromCharCode(...head.slice(from, to));
    return ascii(4, 8) === "ftyp" && /^(heic|heix|hevc|hevx|mif1|msf1)$/.test(ascii(8, 12));
  } catch {
    return false;
  }
};

const PHOTO_MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};
const PHOTO_MIMES = new Set(Object.values(PHOTO_MIME_BY_EXTENSION));

// Some drag sources (Windows, chat apps, downloads folders) hand over a real
// JPEG with an empty `type`. Those used to be dropped silently by the
// `image/` check, so fall back to the extension when the browser gave no type.
const photoMime = (file: File): string | null => {
  if (PHOTO_MIMES.has(file.type)) return file.type;
  if (file.type && file.type !== "application/octet-stream") return null;
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return PHOTO_MIME_BY_EXTENSION[extension] ?? null;
};

export type PhotoIntake = {
  images: ImageMetadata[];
  unsupported: string[];
  unreadable: string[];
};

/**
 * Sort a batch of dropped or picked files into what can be added and what
 * cannot, naming every file that cannot. HEIC is added as-is: the server
 * converts it to an sRGB JPEG on upload. One bad file must never take the
 * others down with it: reads are settled individually, and nothing is dropped
 * without being reported.
 */
export const readPhotoFiles = async (files: File[]): Promise<PhotoIntake> => {
  const heicFlags = await Promise.all(files.map(isHeicFile));
  const intake: PhotoIntake = { images: [], unsupported: [], unreadable: [] };

  const candidates: Array<{ file: File; mime: string; isHeic: boolean }> = [];
  files.forEach((file, i) => {
    const isHeic = heicFlags[i];
    const mime = isHeic ? "image/heic" : photoMime(file);
    if (mime) candidates.push({ file, mime, isHeic });
    else intake.unsupported.push(file.name);
  });

  const reads = await Promise.allSettled(
    candidates.map(
      ({ file, mime, isHeic }) =>
        new Promise<ImageMetadata>((resolve, reject) => {
          const reader = new FileReader();
          // Re-typed so an empty-type file still gets a data URL the <img> and
          // dataURLtoFile understand.
          reader.onload = () => resolve({ name: file.name, src: reader.result as string, isHeic });
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(new File([file], file.name, { type: mime }));
        })
    )
  );

  reads.forEach((result, i) => {
    if (result.status === "fulfilled") intake.images.push(result.value);
    else intake.unreadable.push(candidates[i].file.name);
  });

  return intake;
};

export const dataURLtoFile = (dataUrl: string, filename: string) => {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

const getImageExtension = (blob: Blob, imageUrl: string) => {
  const mimeToExtension: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  if (blob.type && mimeToExtension[blob.type]) {
    return mimeToExtension[blob.type];
  }

  try {
    const pathname = new URL(imageUrl).pathname;
    const candidate = pathname.split(".").pop()?.toLowerCase();
    if (candidate && ["png", "jpg", "jpeg", "webp", "gif"].includes(candidate)) {
      return candidate === "jpeg" ? "jpg" : candidate;
    }
  } catch {
    // Fall through to a safe default below.
  }

  return "png";
};

export const handleDownloadImage = async (image: string | null) => {
  if (!image) return;

  try {
    const response = await fetch(image, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Image download failed with status ${response.status}`);
    }

    const blob = await response.blob();
    const extension = getImageExtension(blob, image);
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = `printpetz_${Date.now()}.${extension}`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Give Safari/iOS enough time to begin the download before releasing the blob URL.
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch (error) {
    console.error("Error downloading image:", error);

    // Last-resort fallback for browsers that block cross-origin blob downloads.
    const link = document.createElement("a");
    link.href = image;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
