import {DbProfile} from '../repositories/profiles.repository';
import {Id} from '../model/id.model';
import {Profile} from '../model/profile.model';

export const dbProfileToProfileModel = (dbProfile: DbProfile): Id<Profile> => {
  return {
    id: dbProfile.profile_id,
    name: dbProfile.name,
    lastName: dbProfile.last_name,
    email: dbProfile.email,
    password: dbProfile.password,
  };
};
