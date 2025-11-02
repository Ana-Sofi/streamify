import {StaffMember} from '../model/staff-member.model';
import {Id} from '../model/id.model';
import {DbStaffMember} from '../repositories/staff-members.repository';

export const dbStaffMemberToModelStaffMember = (
  dbStaffMember: DbStaffMember
): Id<StaffMember> => {
  return {
    id: dbStaffMember.staff_member_id,
    name: dbStaffMember.name,
    lastName: dbStaffMember.last_name,
  };
};
