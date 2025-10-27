import {DbProfile} from '../repositories/profiles.repository';
import {Id} from '../model/id.model';
import {Profile} from '../model/profile.model';
import {makeMapFunction} from '../utils/map.util';

export const dbProfileToProfileModel = makeMapFunction([
  ['profile_id', 'id'],
  ['name', 'name'],
  ['email', 'email'],
  ['password', 'password'],
]) as (dbProfile: DbProfile, prefix?: string) => Id<Profile>;
