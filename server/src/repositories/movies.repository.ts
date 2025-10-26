import {sql} from '../config/postgress-conntection';
import {dbMovieToModelMovie} from '../mappers/movie.mapper';
import {Id} from '../model/id.model';
import {Movie} from '../model/movie.model';

export type DbMovie = {
  movie_id: number;
  name: string;
  description: string;
  view_count: number;
  score_average: number;
};

export async function getAllMovies() {
  const dbMovies = (await sql`
    select * from streamify.movie
  `) as DbMovie[];

  return dbMovies.map(dbMovie => dbMovieToModelMovie(dbMovie));
}

export async function getMovie(id: number) {
  const dbMovies = (await sql`
    select * from streamify.movie where movie_id = ${id}
  `) as DbMovie[];

  const first = dbMovies[0];

  if (!first) return null;
  return dbMovieToModelMovie(first);
}

export async function insertMovie(movie: Movie) {
  const result = await sql`
    insert into streamify.movie(name, description, view_count, score_average) 
    values (${movie.name}, ${movie.description}, ${movie.viewCount}, ${movie.scoreAverage})
  `;

  return result.count;
}

export async function patchMovie(movie: Id<Partial<Movie>>) {
  const patchedFields = [] as [string, Movie[keyof Movie]][];
  if (movie.name) patchedFields.push(['name', movie.name]);
  if (movie.description) patchedFields.push(['description', movie.description]);
  if (movie.viewCount) patchedFields.push(['view_count', movie.viewCount]);
  if (movie.scoreAverage)
    patchedFields.push(['score_average', movie.scoreAverage]);

  if (patchedFields.length === 0) return -1;
  const patchSql =
    'update streamify.movie set ' +
    patchedFields.map(([field], i) => `${field} = $${i + 1}`).join(', ') +
    ` where movie_id = ${movie.id}`;
  const values = patchedFields.map(([, value]) => value);

  const result = await sql.unsafe(patchSql, values);
  return result.count;
}

export async function deleteMovie(id: number) {
  const result = await sql`delete from streamify.movie where movie_id = ${id}`;
  return result.count;
}
