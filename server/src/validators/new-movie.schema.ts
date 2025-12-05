import {object, string} from 'yup';

export const newMovieSchema = object({
  name: string().required(),
  description: string().required(),
  imageUrl: string().optional(),
}).strict();
