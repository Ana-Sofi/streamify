import {Movie} from '../model/movie.model';
import {DbMovie} from '../repositories/movie.repository';

export function dbMovieToModelMovie(dbMovie: DbMovie): Movie {
  return {
    id: dbMovie.movie_id,
    name: dbMovie.name,
    description: dbMovie.description,
    scoreAverage: dbMovie.score_average,
    viewCount: dbMovie.view_count,
  };
}
