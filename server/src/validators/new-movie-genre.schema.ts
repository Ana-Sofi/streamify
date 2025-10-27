import {number, object} from 'yup';

export const newMovieGenreSchema = object({
  movieId: number().required(),
  genreId: number().required(),
});
