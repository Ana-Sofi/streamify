import {Router} from 'express';
import {
  deleteView,
  getAllViewsByProfile,
  insertView,
  patchView,
} from '../repositories/views.repository';
import {newViewSchema} from '../validators/new-view.schema';
import {NotFoundError} from '../errors/not-found.error';
import {ForbiddenError} from '../errors/forbidden.error';
import {deleteViewSchema} from '../validators/delete-view.schema';
import {updateMovieAverage} from '../repositories/movies.repository';

const router = Router();

async function handleMovieScoreAverage(movieId: number) {
  const result = await updateMovieAverage(movieId);

  if (result === 0)
    console.warn('Movie not found while updating score average!');
}

router.get('/', async (req, res, next) => {
  const views = await getAllViewsByProfile(req.user.id);

  res.status(200).send(views);
});

router.post('/', async (req, res, next) => {
  const view = await newViewSchema.validate({
    ...req.body,
    profileId: req.user.id,
  });
  const rowsAltered = await insertView(view);
  if (rowsAltered === 0) throw new NotFoundError('Movie not found!');
  else if (rowsAltered === -1) throw new ForbiddenError('View already exists!');

  await handleMovieScoreAverage(view.movieId);
  res.status(201).send({message: `Success ${rowsAltered} rows created`});
});

router.patch('/', async (req, res, next) => {
  const view = await newViewSchema.validate({
    ...req.body,
    profileId: req.user.id,
  });
  const rowsAltered = await patchView(view);

  if (rowsAltered === 0) throw new NotFoundError('View not found!');

  await handleMovieScoreAverage(view.movieId);
  res.status(200).send({message: `Success: ${rowsAltered} rows updated`});
});

router.delete('/', async (req, res, next) => {
  const view = await deleteViewSchema.validate({
    ...req.body,
    profileId: req.user.id,
  });
  const rowsAltered = await deleteView(view);

  if (rowsAltered === 0) throw new NotFoundError('View not found!');

  await handleMovieScoreAverage(view.movieId);
  res.status(200).send({message: `Success: ${rowsAltered} rows deleted`});
});

export const viewsRouter: Router = router;
