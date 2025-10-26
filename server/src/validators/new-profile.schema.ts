import {object, string} from 'yup';

export const newProfileSchema = object({
  name: string().required(),
  lastName: string().required(),
  email: string().email().required(),
  password: string().required(),
});
