import {PostgresError} from 'postgres';
import {sql} from '../config/postgress-conntection';
import {dbProfileToProfileModel} from '../mappers/profile.mapper';
import {Profile} from '../model/profile.model';
import {getPatchedFields} from '../utils/query.util';
import {Id} from '../model/id.model';

export type DbProfile = {
  profile_id: number;
  name: string;
  last_name: string;
  email: string;
  password: string;
};

export async function getAllProfiles() {
  const dbProfiles = (await sql`
    select * from streamify.profile
  `) as DbProfile[];
}

export async function getProfileByEmail(email: string) {
  const dbProfiles = (await sql`
    select * from streamify.profile where email ILIKE ${email}
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

export async function patchProfile(profile: Id<Partial<Profile>>) {
  const patchedFields = getPatchedFields(
    [
      ['name', 'name'],
      ['last_name', 'lastName'],
      ['email', 'email'],
      ['password', 'password'],
    ],
    profile,
  );

  if (patchedFields.length === 0) return -1;
  const patchSql =
    'update streamify.movie set ' +
    patchedFields.map(([field], i) => `${field} = $${i + 1}`).join(', ') +
    ` where profile_id = $${patchedFields.length + 1}`;
  const values = patchedFields.map(([, value]) => value);
  values.push(profile.id);

  const result = await sql.unsafe(patchSql, values);
  return result.count;
}

export async function deleteProfile(id: number) {
  const result =
    await sql`delete from streamify.profile where profile_id = ${id}`;
  return result.count;
}
