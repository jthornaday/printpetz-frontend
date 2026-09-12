export interface IModelTrainingRequest {
  name: string;
  petName: string;
  petDescription?: string;
  images: string[];
}

export interface TrainModelRequest {
  name: string;
  petName: string;
  petDescription?: string;
  images: string[];
}
