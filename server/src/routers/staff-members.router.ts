import {Router} from 'express';
import {
  deleteStaffMember,
  getAllStaffMembers,
  getStaffMemberById,
  insertStaffMember,
  patchStaffMember,
} from '../repositories/staff-members.repository';
import {newStaffMemberSchema} from '../validators/new-staff-member.schema';
import {patchStaffMemberSchema} from '../validators/patch-staff-member.schema';
import {idParamSchema} from '../validators/id-param.schema';
import {NotFoundError} from '../errors/not-found.error';
import {BadRequestError} from '../errors/bad-request.error';

const router: Router = Router();

router.get('/', async (req, res, next) => {
  const staffMembers = await getAllStaffMembers();
  res.status(200).send(staffMembers);
});

router.get('/:id', async (req, res, next) => {
  const {id} = await idParamSchema.validate(req.params);

  const staffMember = await getStaffMemberById(id);

  if (!staffMember) throw new NotFoundError('Staff Member not found!');
  else res.status(200).send(staffMember);
});

router.post('/', async (req, res, next) => {
  const staffMember = await newStaffMemberSchema.validate(req.body);

  const rowsAltered = await insertStaffMember(staffMember);
  res.status(201).send({message: `Success: ${rowsAltered} rows created`});
});

router.patch('/:id', async (req, res, next) => {
  const staffMember = await patchStaffMemberSchema.validate({
    ...req.body,
    id: req.params.id,
  });

  const rowsAltered = await patchStaffMember(staffMember);

  if (rowsAltered === -1)
    throw new BadRequestError('No fields to patch were given!');
  else if (rowsAltered > 0)
    res.status(200).send({message: `Success: ${rowsAltered} rows updated`});
  else throw new NotFoundError('Staff Member not found!');
});

router.delete('/:id', async (req, res, next) => {
  const {id} = await idParamSchema.validate(req.params);
  const rowsAltered = await deleteStaffMember(id);

  if (rowsAltered > 0)
    res.status(200).send({message: `Success: ${rowsAltered} rows deleted`});
  else throw new NotFoundError('Staff Member not found!');
});

export const staffMemberRouter = router;
