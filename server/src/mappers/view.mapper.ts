import {Id} from '../model/id.model';
import {ViewAggregated} from '../model/view.model';
import {DbView} from '../repositories/views.repository';
import {makeMapFunction} from '../utils/map.util';
import {dbMovieToModelMovie} from './movie.mapper';

const dbViewToModelView = makeMapFunction([
  ['view_id', 'id'],
  ['score', 'score'],
]);
export const dbViewToModelViewAggregated = ((view: DbView) => {
  const mapped = dbViewToModelView(view);
  const {movie} = view;

  if (movie && movie[0]) mapped.movie = dbMovieToModelMovie(movie[0]);

  return mapped;
}) as (view: DbView) => Id<ViewAggregated>;
