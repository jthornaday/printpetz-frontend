export enum EUploadFile {
  PROFILE_IMAGE = "PROFILE_IMAGE",
  TRAINING_IMAGE = "TRAINING_IMAGE",
}

export interface FileUploadRequest {
  files: File[];
  type: EUploadFile;
}

export interface FileUploadResponse {
  fileUrls: string[];
}
