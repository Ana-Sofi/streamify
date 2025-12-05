import {Movie} from '../model/movie.model';
import {Id} from '../model/id.model';
import {DbMovie} from '../repositories/movies.repository';

export const dbMovieToModelMovie = (dbMovie: DbMovie): Id<Movie> => {
  return {
    id: dbMovie.movie_id,
    name: dbMovie.name,
    description: dbMovie.description,
    scoreAverage: parseFloat(dbMovie.score_average) || 0,
    viewCount: dbMovie.view_count,
    imageUrl: dbMovie.image_url || undefined,
  };
};
