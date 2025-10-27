import {sql} from '../config/postgress-conntection';
import {dbGenreToModelGenre} from '../mappers/genre.mapper';
import {Genre} from '../model/genre.model';
import {Id} from '../model/id.model';
import {getPatchedFields} from '../utils/query.util';

export type DbGenre = {
  genre_id: number;
  genre_name: string;
};

export async function getAllGenres() {
  const dbGenres = (await sql`
    select * from streamify.genre
  `) as DbGenre[];

  return dbGenres.map(dbGenre => dbGenreToModelGenre(dbGenre));
}

export async function getGenreById(id: number) {
  const dbGenres = (await sql`
    select * from streamify.genre where genre_id = ${id}
  `) as DbGenre[];

  const first = dbGenres[0];

  if (!first) return null;
  return dbGenreToModelGenre(first);
}

export async function insertGenre(genre: Genre) {
  const result = await sql`
    insert into streamify.genre(genre_name)
    values (${genre.name})
  `;
  return result.count;
}

export async function patchGenre(genre: Id<Partial<Genre>>) {
  const patchedFields = getPatchedFields([['genre_name', 'name']], genre);

  if (patchedFields.length === 0) return -1;
  const patchSql =
    'update streamify.genre set ' +
    patchedFields.map(([field], i) => `${field} = $${i + 1}`).join(', ') +
    ` where genre_id = $${patchedFields.length + 1}`;
  const values = patchedFields.map(([, value]) => value);
  values.push(genre.id);
  console.debug(patchSql, values);

  const result = await sql.unsafe(patchSql, values);
  return result.count;
}

export async function deleteGenre(id: number) {
  const result = await sql`delete from streamify.genre where genre_id = ${id}`;
  return result.count;
}
