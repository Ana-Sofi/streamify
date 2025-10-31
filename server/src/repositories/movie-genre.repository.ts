import {sql} from '../config/postgress-conntection';
import {DbGenre} from './genres.repository';
import {MovieGenre} from '../model/movie-genre.model';
import {PostgresError} from 'postgres';
import {dbGenreToModelGenre} from '../mappers/genre.mapper';
import {DbMovie} from './movies.repository';
import {dbMovieToModelMovie} from '../mappers/movie.mapper';

export async function getMovieGenres(movieId: number) {
  const dbGenres = (await sql`
    select g.* from streamify.movie_genre mg
    inner join streamify.genre g
      on mg.genre_id = g.genre_id
    where mg.movie_id = ${movieId}
  `) as DbGenre[];

  return dbGenres.map(dbGenre => dbGenreToModelGenre(dbGenre));
}

export async function getGenreMovies(genreId: number) {
  const dbMovies = (await sql`
    select m.* from streamify.movie_genre mg
    inner join streamify.movie m
      on mg.movie_id = m.movie_id
    where mg.genre_id = ${genreId}
  `) as DbMovie[];

  return dbMovies.map(dbMovie => dbMovieToModelMovie(dbMovie));
}

export async function insertMovieGenre(movieGenre: MovieGenre) {
  try {
    const result = await sql`
    insert into streamify.movie_genre(movie_id, genre_id)
    values (${movieGenre.movieId}, ${movieGenre.genreId})
  `;

    return result.count;
  } catch (err) {
    if (err instanceof PostgresError) {
      if (err.code === '23505') return -1;
      else if (err.code === '23503') return 0;
    }
    throw err;
  }
}

export async function deleteMovieGenre(movieGenre: MovieGenre) {
  const result = await sql`
    delete from streamify.movie_genre
    where movie_id = ${movieGenre.movieId} and genre_id = ${movieGenre.genreId}
  `;

  return result.count;
}
