import {PostgresError} from 'postgres';
import {sql} from '../config/postgress-conntection';
import {MovieStaff} from '../model/movie-staff.model';
import {DbStaffMember} from './staff-members.repository';
import {DbMovie} from './movies.repository';
import {toMovieStaffAggregated} from '../mappers/movie-staff.mapper';
import {Id} from '../model/id.model';

export type DbMovieStaff = {
  movie_staff_id: number;
  role_name: string;
  movie_id: number;
  staff_member_id: number;
  movie?: DbMovie[];
  staff_member?: DbStaffMember[];
};

export async function getMovieStaff(movieId: number) {
  const dbMovieStaff = (await sql`
    select
      ms.*,
      json_agg(row_to_json(sm)) as staff_member
    from streamify.movie_staff ms
    inner join streamify.staff_member sm
      on sm.staff_member_id = ms.staff_member_id
    where ms.movie_id = ${movieId}
    group by ms.movie_staff_id
  `) as DbMovieStaff[];

  return dbMovieStaff.map(
    movieStaff =>
      toMovieStaffAggregated(movieStaff) as Omit<
        ReturnType<typeof toMovieStaffAggregated>,
        'movie'
      >,
  );
}

export async function getStaffMovies(staffMemberId: number) {
  const dbMovieStaff = (await sql`
    select
      ms.*,
      json_agg(row_to_json(m)) as movie
    from streamify.movie_staff ms
    inner join streamify.movie m
      on ms.movie_id = m.movie_id
    where ms.staff_member_id = ${staffMemberId}
    group by ms.movie_staff_id
  `) as DbMovieStaff[];

  return dbMovieStaff.map(
    movieStaff =>
      toMovieStaffAggregated(movieStaff) as Omit<
        ReturnType<typeof toMovieStaffAggregated>,
        'member'
      >,
  );
}

export async function insertMovieStaff(movieStaff: MovieStaff) {
  try {
    const result = await sql`
      insert into streamify.movie_staff(movie_id, staff_member_id, role_name)
      values (${movieStaff.movieId}, ${movieStaff.staffMemberId}, ${movieStaff.roleName})
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

export async function patchMovieStaffByMovie(
  movieStaff: Id<Omit<MovieStaff, 'staffMemberId'>>,
) {
  const result = await sql`
    update streamify.movie_staff
    set role_name = ${movieStaff.roleName}
    where movie_staff_id = ${movieStaff.id} and movie_id = ${movieStaff.movieId}
  `;

  return result.count;
}

export async function patchMovieStaffByStaff(
  movieStaff: Id<Omit<MovieStaff, 'movieId'>>,
) {
  const result = await sql`
    update streamify.movie_staff
    set role_name = ${movieStaff.roleName}
    where movie_staff_id = ${movieStaff.id} and staff_member_id = ${movieStaff.staffMemberId}
  `;

  return result.count;
}

export async function deleteMovieStaffByMovie(
  movieStaff: Id<Omit<MovieStaff, 'staffMemberId' | 'roleName'>>,
) {
  const result = await sql`
    delete from streamify.movie_staff
    where movie_staff_id = ${movieStaff.id} and movie_id = ${movieStaff.movieId}
  `;

  return result.count;
}

export async function deleteMovieStaffByStaff(
  movieStaff: Id<Omit<MovieStaff, 'movieId' | 'roleName'>>,
) {
  const result = await sql`
    delete from streamify.movie_staff
    where movie_staff_id = ${movieStaff.id} and staff_member_id = ${movieStaff.staffMemberId}
  `;

  return result.count;
}
