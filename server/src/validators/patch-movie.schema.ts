import {number, object, string} from 'yup';

export const patchMovieSchema = object({
  id: number().required(),
  name: string().optional(),
  description: string().optional(),
  viewCount: number().optional(),
  scoreAverage: number().optional(),
});
