import {DbMovieStaff} from '../repositories/movie-staff.repository';
import {makeMapFunction} from '../utils/map.util';
import {dbMovieToModelMovie} from './movie.mapper';
import {dbStaffMemberToModelStaffMember} from './staff-member.mapper';
import {Id} from '../model/id.model';
import {MovieStaffAggregated} from '../model/movie-staff.model';

const dbMSToMSModel = makeMapFunction([
  ['movie_staff_id', 'id'],
  ['role_name', 'roleName'],
]);

export const toMovieStaffAggregated = ((dbMovieStaff: DbMovieStaff) => {
  const mapping = dbMSToMSModel(dbMovieStaff);

  const {staff_member, movie} = dbMovieStaff;
  if (staff_member && staff_member[0])
    mapping.member = dbStaffMemberToModelStaffMember(staff_member[0]);

  if (movie && movie[0]) mapping.movie = dbMovieToModelMovie(movie[0]);

  return mapping;
}) as (dbMovieStaff: DbMovieStaff) => Id<MovieStaffAggregated>;
