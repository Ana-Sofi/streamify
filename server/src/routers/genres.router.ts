import {Router} from 'express';
import {idParamSchema} from '../validators/id-param.schema';
import {NotFoundError} from '../errors/not-found.error';
import {BadRequestError} from '../errors/bad-request.error';
import {
  deleteGenre,
  getAllGenres,
  getGenreById,
  insertGenre,
  patchGenre,
} from '../repositories/genres.repository';
import {newGenreSchema} from '../validators/new-genre.schema';
import {patchGenreSchema} from '../validators/patch-genre.schema';

const router: Router = Router();

router.get('/', async (req, res, next) => {
  const genres = await getAllGenres();

  res.status(200).send(genres);
});

router.get('/:id', async (req, res, next) => {
  const {id} = await idParamSchema.validate(req.params);

  const genre = await getGenreById(id);

  if (!genre) throw new NotFoundError('Genre not found!');
  res.status(200).send(genre);
});

router.post('/', async (req, res, next) => {
  const genre = await newGenreSchema.validate(req.body);

  const rowsAltered = await insertGenre(genre);
  res.status(201).send({message: `Success: ${rowsAltered} rows created`});
});

router.patch('/:id', async (req, res, next) => {
  const genre = await patchGenreSchema.validate({
    ...req.body,
    id: req.params.id,
  });

  const rowsAltered = await patchGenre(genre);

  if (rowsAltered === -1)
    throw new BadRequestError('No fields to patch were given!');
  else if (rowsAltered > 0)
    res.status(200).send({message: `Success: ${rowsAltered} rows updated`});
  else throw new NotFoundError('Genre not found!');
});

router.delete('/:id', async (req, res, next) => {
  const {id} = await idParamSchema.validate(req.params);
  const rowsAltered = await deleteGenre(id);

  if (rowsAltered > 0)
    res.status(200).send({message: `Success: ${rowsAltered} rows deleted`});
  else throw new NotFoundError('Genre not found!');
});

export const genresRouter = router;
