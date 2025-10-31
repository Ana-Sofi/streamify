import {sql} from '../config/postgress-conntection';
import {dbMovieToModelMovie} from '../mappers/movie.mapper';
import {Id} from '../model/id.model';
import {Movie} from '../model/movie.model';
import {getPatchedFields} from '../utils/query.util';

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

export async function getMovieById(id: number) {
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
  const patchedFields = getPatchedFields(
    [
      ['name', 'name'],
      ['description', 'description'],
      ['view_count', 'viewCount'],
      ['score_average', 'scoreAverage'],
    ],
    movie,
  );

  if (patchedFields.length === 0) return -1;
  const patchSql =
    'update streamify.movie set ' +
    patchedFields.map(([field], i) => `${field} = $${i + 1}`).join(', ') +
    ` where movie_id = $${patchedFields.length + 1}`;
  const values = patchedFields.map(([, value]) => value);
  values.push(movie.id);

  const result = await sql.unsafe(patchSql, values);
  return result.count;
}

export async function deleteMovie(id: number) {
  const result = await sql`delete from streamify.movie where movie_id = ${id}`;
  return result.count;
}

export async function updateMovieAverage(movieId: number) {
  const result = await sql`
    update streamify.movie m
    set score_average = (
      select avg(v.score)
      from streamify.view v
      where v.movie_id = m.movie_id
    ) where m.movie_id = ${movieId}
  `;

  return result.count;
}
