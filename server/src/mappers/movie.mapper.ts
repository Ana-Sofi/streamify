import {Movie} from '../model/movie.model';
import {Id} from '../model/id.model';
import {DbMovie} from '../repositories/movie.repository';

export function dbMovieToModelMovie(dbMovie: DbMovie) {
  return {
    id: dbMovie.movie_id,
    name: dbMovie.name,
    description: dbMovie.description,
    scoreAverage: dbMovie.score_average,
    viewCount: dbMovie.view_count,
  } as Id<Movie>;
}
