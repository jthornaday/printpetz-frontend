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

export const handleDownloadImage = async (image: string | null) => {
  if (!image) return;

  try {
    const response = await fetch(image, { cache: "no-store" });

    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "printpetz_" + Date.now() + image.split(".")[1];
    link.click();

    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
};
