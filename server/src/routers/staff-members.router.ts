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
import {
  deleteMovieStaffByStaff,
  getStaffMovies,
  insertMovieStaff,
  patchMovieStaffByStaff,
} from '../repositories/movie-staff.repository';
import {newMovieStaffSchema} from '../validators/new-movie-staff.schema';
import {ForbiddenError} from '../errors/forbidden.error';
import {patchStaffMovieSchema} from '../validators/patch-movie-staff.schema';
import {deleteStaffMovieSchema} from '../validators/delete-movie-staff.schema';

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

router.get('/:id/movies', async (req, res, next) => {
  const {id} = await idParamSchema.validate(req.params);
  const staff = await getStaffMovies(id);

  res.status(200).send(staff);
});

router.post('/:id/movies', async (req, res, next) => {
  const movieStaff = await newMovieStaffSchema.validate({
    ...req.body,
    staffMemberId: req.params.id,
  });

  const rowsAltered = await insertMovieStaff(movieStaff);
  if (rowsAltered === 0)
    throw new NotFoundError('Movie or Staff Member not found!');
  else if (rowsAltered === -1)
    throw new ForbiddenError('Movie Staff already exists!');
  res.status(201).send({message: `Success: ${rowsAltered} rows created`});
});

router.patch('/:id/movies', async (req, res, next) => {
  const movieStaff = await patchStaffMovieSchema.validate({
    ...req.body,
    staffMemberId: req.params.id,
  });
  const rowsAltered = await patchMovieStaffByStaff(movieStaff);

  if (rowsAltered === 0) throw new NotFoundError('Movie Staff not found!');
  else res.status(200).send({message: `Success: ${rowsAltered} rows updated`});
});

router.delete('/:id/movies', async (req, res, next) => {
  const movieStaff = await deleteStaffMovieSchema.validate({
    ...req.body,
    staffMemberId: req.params.id,
  });
  const rowsAltered = await deleteMovieStaffByStaff(movieStaff);

  if (rowsAltered > 0)
    res.status(200).send({message: `Success: ${rowsAltered} rows deleted`});
  else throw new NotFoundError('Movie Staff not found!');
});

export const staffMemberRouter = router;
