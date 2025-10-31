import {number, object, string} from 'yup';

export const patchMovieStaffSchema = object({
  id: number().required(),
  movieId: number().required(),
  roleName: string().required(),
});

export const patchStaffMovieSchema = object({
  id: number().required(),
  staffMemberId: number().required(),
  roleName: string().required(),
});
