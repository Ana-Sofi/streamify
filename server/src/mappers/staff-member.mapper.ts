import {StaffMember} from '../model/staff-member.model';
import {Id} from '../model/id.model';
import {DbStaffMember} from '../repositories/staff-members.repository';
import {makeMapFunction} from '../utils/map.util';

export const dbStaffMemberToModelStaffMember = makeMapFunction([
  ['staff_member_id', 'id'],
  ['name', 'name'],
  ['last_name', 'lastName'],
]) as (dbStaffMember: DbStaffMember) => Id<StaffMember>;
