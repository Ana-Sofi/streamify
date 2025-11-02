import {sql} from '../config/postgress-conntection';
import {dbStaffMemberToModelStaffMember} from '../mappers/staff-member.mapper';
import {Id} from '../model/id.model';
import {StaffMember} from '../model/staff-member.model';
import {getPatchedFields} from '../utils/query.util';

export type DbStaffMember = {
  staff_member_id: number;
  name: string;
  last_name: string;
};

export async function getAllStaffMembers() {
  const dbStaffMembers = (await sql`
    select * from streamify.staff_member
  `) as DbStaffMember[];

  return dbStaffMembers.map(dbStaffMember =>
    dbStaffMemberToModelStaffMember(dbStaffMember),
  );
}

export async function getStaffMemberById(id: number) {
  const dbStaffMembers = (await sql`
    select * from streamify.staff_member where staff_member_id = ${id}
  `) as DbStaffMember[];

  const first = dbStaffMembers[0];

  if (!first) return null;
  return dbStaffMemberToModelStaffMember(first);
}

export async function insertStaffMember(staffMember: StaffMember) {
  const result = await sql`
    insert into streamify.staff_member(name, last_name)
    values (${staffMember.name}, ${staffMember.lastName})
  `;

  return result.count;
}

export async function patchStaffMember(staffMember: Id<Partial<StaffMember>>) {
  const patchedFields = getPatchedFields(
    [
      ['name', 'name'],
      ['last_name', 'lastName'],
    ],
    staffMember,
  );

  if (patchedFields.length === 0) return -1;
  const patchSql =
    'update streamify.staff_member set ' +
    patchedFields.map(([field], i) => `${field} = $${i + 1}`).join(', ') +
    ` where staff_member_id = $${patchedFields.length + 1}`;
  const values = patchedFields.map(([, value]) => value);
  values.push(staffMember.id);

  const result = await sql.unsafe(patchSql, values);
  return result.count;
}

export async function deleteStaffMember(id: number) {
  const result =
    await sql`delete from streamify.staff_member where staff_member_id = ${id}`;
  return result.count;
}
