import {Movie} from '../model/movie.model';
import {Id} from '../model/id.model';
import {DbMovie} from '../repositories/movies.repository';
import {makeMapFunction} from '../utils/map.util';

export const dbMovieToModelMovie = makeMapFunction([
  ['movie_id', 'id'],
  ['name', 'name'],
  ['description', 'description'],
  ['score_average', 'scoreAverage'],
  ['view_count', 'viewCount'],
]) as (dbMovie: DbMovie) => Id<Movie>;
