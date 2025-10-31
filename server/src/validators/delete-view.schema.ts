import {number, object} from 'yup';

export const deleteViewSchema = object({
  profileId: number().required(),
  movieId: number().required(),
});
