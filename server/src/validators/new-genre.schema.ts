import {object, string} from 'yup';

export const newGenreSchema = object({
  name: string().required(),
});
