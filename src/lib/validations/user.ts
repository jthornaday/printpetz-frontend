import { IUpdateUserRequest } from "@/types/user";
import { object, ObjectSchema, string } from "yup";

export const updateUserSchema: ObjectSchema<IUpdateUserRequest> = object({
  name: string(),
  email: string(),
  profile_image: string(),
});
