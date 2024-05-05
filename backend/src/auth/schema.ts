import { object, string, number, date, InferType } from "yup";

export const userSchema = object({
  // firstName: string().required(),
  // lastName: string().required(),
  password: string().required(),
  email: string().email(),
  // phoneNumber: string(),
  // userName: string().required(),
});
