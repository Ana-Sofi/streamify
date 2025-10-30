import {number, object, string} from 'yup';

export const patchProfileSchema = object({
  id: number().required(),
  name: string().optional(),
  lastName: string().optional(),
  email: string().email().optional(),
  password: string().optional(),
});
