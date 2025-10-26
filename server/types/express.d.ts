import {Id} from '../src/model/id.model';
import {Profile} from '../src/model/profile.model';
import {Passwordless} from '../src/model/passwordless.model';

declare global {
  namespace Express {
    interface Request {
      user: Passwordless<Id<Profile>>;
    }
  }
}

export {};
