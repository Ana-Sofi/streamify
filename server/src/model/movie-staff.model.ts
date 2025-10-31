import {Id} from './id.model';
import {Movie} from './movie.model';
import {StaffMember} from './staff-member.model';

export type MovieStaff = {
  movieId: number;
  staffMemberId: number;
  roleName: string;
};

export type MovieStaffAggregated = {
  movie: Id<Movie>;
  member: Id<StaffMember>;
  roleName: string;
};
