import {number, object, string} from 'yup';

export const patchGenreSchema = object({
  id: number().required(),
  name: string(),
});
