import {sql} from '../config/postgress-conntection';
import {dbMovieToModelMovie} from '../mappers/movie.mapper';
import {Movie} from '../model/movie.model';

export type DbMovie = {
  movie_id: number;
  name: string;
  description: string;
  view_count: number;
  score_average: number;
};

export async function fetchAllMovies(): Promise<Movie[]> {
  const dbMovies = (await sql`
    select * from streamify.movie;
  `) as DbMovie[];

  return dbMovies.map(dbMovie => dbMovieToModelMovie(dbMovie));
}

export async function getMovieById(id: string): Promise<Movie | null> {
  const dbMovies = (await sql`
    select * from streamify.movie where movie_id = ${id}
  `) as DbMovie[];

  const first = dbMovies[0];

  if (!first) return null;
  return dbMovieToModelMovie(first);
}
