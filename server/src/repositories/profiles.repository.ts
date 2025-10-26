import {PostgresError} from 'postgres';
import {sql} from '../config/postgress-conntection';
import {dbProfileToProfileModel} from '../mappers/profile.mapper';
import {Profile} from '../model/profile.model';

export type DbProfile = {
  profile_id: number;
  name: string;
  last_name: string;
  email: string;
  password: string;
};

export async function getProfileByEmail(email: string) {
  const dbProfiles = (await sql`
    select * from streamify.profile where email = ${email}
  `) as DbProfile[];

  const first = dbProfiles[0];

  if (!first) return null;
  else return dbProfileToProfileModel(first);
}

export async function getProfileById(id: number) {
  const dbProfiles = (await sql`
    select * from streamify.profile where profile_id = ${id}
  `) as DbProfile[];

  const first = dbProfiles[0];

  if (!first) return null;
  else return dbProfileToProfileModel(first);
}

export async function insertProfile(profile: Profile) {
  try {
    const result = await sql`
    insert into streamify.profile(name, last_name, email, password)
    values (${profile.name}, ${profile.lastName}, ${profile.email}, ${profile.password})
  `;

    return result.count;
  } catch (err: unknown) {
    if (err instanceof PostgresError && err.code === '23505') {
      return -1; // -1 stands for already exists
    }

    throw err;
  }
}
