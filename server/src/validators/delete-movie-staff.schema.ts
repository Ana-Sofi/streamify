import {number, object} from 'yup';

export const deleteMovieStaffSchema = object({
  id: number().required(),
  movieId: number().required(),
});

export const deleteStaffMovieSchema = object({
  id: number().required(),
  staffMemberId: number().required(),
});
