import {number, object, string} from 'yup';

export const patchStaffMemberSchema = object({
  id: number().required(),
  name: string(),
  lastName: string(),
});
