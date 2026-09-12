import { IModelTrainingRequest } from "@/types/modelTraining";
import { array, object, ObjectSchema, string } from "yup";

export const modelTrainingSchema: ObjectSchema<IModelTrainingRequest> = object({
  petName: string().trim().required("Your pet's name is required"),
  petDescription: string()
    .trim()
    .max(150, "Please keep the description under 150 characters")
    .optional(),
  name: string().trim().required("A name for this pet model is required"),
  images: array(string().required()).required("Images are required"),
});
