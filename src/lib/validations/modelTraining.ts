import { IModelTrainingRequest } from "@/types/modelTraining";
import { array, object, ObjectSchema, string } from "yup";

export const modelTrainingSchema: ObjectSchema<IModelTrainingRequest> = object({
  name: string().required("Name is required"),
  images: array(string().required()).required("Images are required"),
});
