export enum EModelStatus {
  PENDING = "PENDING",
  TRAINING = "TRAINING",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
}

export interface IModel {
  id: number;
  user_id: string;
  name: string;
  training_images: string[];
  model_path: string | null;
  request_id: string | null;
  status: EModelStatus;
  error: any;
  is_deleted: boolean;
}

export type GetModelsParams = {
  user_id: string;
  lastDocId?: string;
  limit?: number;
};

export interface UpdateModelRequest {
  id: number;
  is_deleted?: boolean;
}
