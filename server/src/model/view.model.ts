import {Movie} from './movie.model';

export type View = {
  score: number;
  profileId: number;
  movieId: number;
};

export type ViewAggregated = {
  score: number;
  movie: Movie;
};
