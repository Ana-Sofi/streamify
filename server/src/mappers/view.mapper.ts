import {ViewAggregated} from '../model/view.model';
import {DbView} from '../repositories/views.repository';
import {dbMovieToModelMovie} from './movie.mapper';

export const dbViewToModelViewAggregated = (
  dbView: DbView
): ViewAggregated => {
  if (!dbView.movie?.[0]) {
    throw new Error('Movie data is missing from view aggregation');
  }

  return {
    score: dbView.score ?? 0,
    movie: dbMovieToModelMovie(dbView.movie[0]),
  };
};
