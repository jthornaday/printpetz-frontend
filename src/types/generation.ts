import { IModel } from "./model";
import { IStyle } from "./style";

export enum EGenerationStatus {
  PENDING = "PENDING",
  GENERATING = "GENERATING",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
}

export interface IGeneration {
  id: number;
  user_id: string;
  group_id: number;
  style_id: number;
  model_id: number;
  prompt: string;
  image: string | null;
  request_id: string | null;
  status: EGenerationStatus;
  error: any;
}

export interface IGenerationViewItem {
  id: number;
  prompt: string;
  image: string | null;
  request_id: string | null;
  status: EGenerationStatus;
  error: any;
}

export interface IGenerationView {
  user_id: string;
  group_id: number;
  style: IStyle;
  model: IModel;
  generations: IGenerationViewItem[];
}

export interface GenerateImageRequest {
  styleId: number;
  modelId: number;
  numberOfImages: number;
}

export interface GenerateImageResponse {
  generations: IGeneration[];
}

export interface GetGenerationsRequest {
  user_id: string;
  limit?: number;
  offset?: number;
}

export interface GetGenerationByIdRequest {
  id: number;
}
