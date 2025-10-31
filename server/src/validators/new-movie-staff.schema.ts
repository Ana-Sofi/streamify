import {number, object, string} from 'yup';

export const newMovieStaffSchema = object({
  movieId: number().required(),
  staffMemberId: number().required(),
  roleName: string().required(),
});
