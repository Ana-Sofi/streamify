import {number, object} from 'yup';

export const newViewSchema = object({
  score: number().required(),
  profileId: number().required(),
  movieId: number().required(),
});
