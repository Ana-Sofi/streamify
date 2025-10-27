import {object, string} from 'yup';

export const newStaffMemberSchema = object({
  name: string().required(),
  lastName: string().required(),
});
