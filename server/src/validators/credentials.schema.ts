import {object, string} from 'yup';

export const credentialsSchema = object({
  email: string().email().required(),
  password: string().required(),
});
