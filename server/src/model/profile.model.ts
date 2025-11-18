import {Id} from './id.model';
import {Passwordless} from './passwordless.model';
import {Role} from './role.model';

export type Profile = {
  name: string;
  lastName: string;
  email: string;
  password: string;
};

export type AuthenticatedProfile = Passwordless<Id<Profile>> & {role: Role};
