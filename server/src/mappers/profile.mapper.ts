import {DbProfile} from '../repositories/profiles.repository';
import {Id} from '../model/id.model';
import {Profile} from '../model/profile.model';

export function dbProfileToProfileModel(dbProfile: DbProfile) {
  return {
    id: dbProfile.profile_id,
    name: dbProfile.name,
    email: dbProfile.email,
    password: dbProfile.password,
  } as Id<Profile>;
}
