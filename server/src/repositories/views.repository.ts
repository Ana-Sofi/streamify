import {PostgresError} from 'postgres';
import {sql} from '../config/postgress-conntection';
import {View} from '../model/view.model';
import {DbMovie} from './movies.repository';
import {DbProfile} from './profiles.repository';
import {Id} from '../model/id.model';
import {dbViewToModelViewAggregated} from '../mappers/view.mapper';

export type DbView = {
  view_id: number;
  score?: number;
  profile_id: number;
  movie_id: number;
  profile?: DbProfile[];
  movie?: DbMovie[];
};

export async function getAllViewsByProfile(profileId: number) {
  const dbViews = (await sql`
    select
      v.*,
      json_agg(row_to_json(m)) as movie
    from streamify.view v
    inner join streamify.movie m
      on v.movie_id = m.movie_id
    where v.profile_id = ${profileId}
    group by v.profile_id, v.movie_id
  `) as DbView[];

  return dbViews.map(view => dbViewToModelViewAggregated(view));
}

export async function insertView(view: View) {
  try {
    const result = await sql`
     insert into streamify.view(score, profile_id, movie_id)
     values (${view.score}, ${view.profileId}, ${view.movieId})
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

export async function patchView(view: View) {
  const result = await sql`
    update streamify.view
    set score = ${view.score}
    where movie_id = ${view.movieId} and profile_id = ${view.profileId}
  `;

  return result.count;
}

export async function deleteView(view: Omit<View, 'score'>) {
  const result = await sql`
    delete from streamify.view
    where movie_id = ${view.movieId} and profile_id = ${view.profileId}
  `;
  return result.count;
}
