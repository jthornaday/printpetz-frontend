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
