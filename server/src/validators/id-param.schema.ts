import {number, object} from 'yup';

export const idParamSchema = object({
  id: number().required(),
});
