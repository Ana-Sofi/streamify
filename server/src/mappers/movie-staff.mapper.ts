import {DbMovieStaff} from '../repositories/movie-staff.repository';
import {dbMovieToModelMovie} from './movie.mapper';
import {dbStaffMemberToModelStaffMember} from './staff-member.mapper';
import {Id} from '../model/id.model';
import {MovieStaffAggregated} from '../model/movie-staff.model';

export const toMovieStaffAggregated = (
  dbMovieStaff: DbMovieStaff
): Id<Partial<MovieStaffAggregated> & {roleName: string}> => {
  const result: any = {
    id: dbMovieStaff.movie_staff_id,
    roleName: dbMovieStaff.role_name,
  };

  if (dbMovieStaff.movie?.[0]) {
    result.movie = dbMovieToModelMovie(dbMovieStaff.movie[0]);
  }

  if (dbMovieStaff.staff_member?.[0]) {
    result.member = dbStaffMemberToModelStaffMember(dbMovieStaff.staff_member[0]);
  }

  return result;
};
