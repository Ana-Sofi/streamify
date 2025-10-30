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
import {
  deleteMovieGenre,
  getGenreMovies,
  insertMovieGenre,
} from '../repositories/movie-genre.repository';
import {newMovieGenreSchema} from '../validators/new-movie-genre.schema';
import {ForbiddenError} from '../errors/forbidden.error';

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

router.get('/:id/movies', async (req, res, next) => {
  const {id} = await idParamSchema.validate(req.params);
  const movies = await getGenreMovies(id);

  res.status(200).send(movies);
});

router.post('/:id/movies', async (req, res, next) => {
  const movieGenre = await newMovieGenreSchema.validate({
    ...req.body,
    genreId: req.params.id,
  });

  const rowsAltered = await insertMovieGenre(movieGenre);
  if (rowsAltered === 0) throw new NotFoundError('Movie or Genre not found!');
  else if (rowsAltered === -1)
    throw new ForbiddenError('Movie Genre already exists!');
  res.status(201).send({message: `Success ${rowsAltered} rows created`});
});

router.delete('/:id/movies', async (req, res, next) => {
  const movieGenre = await newMovieGenreSchema.validate({
    ...req.body,
    genreId: req.params.id,
  });
  const rowsAltered = await deleteMovieGenre(movieGenre);

  if (rowsAltered > 0)
    res.status(200).send({message: `Success: ${rowsAltered} rows deleted`});
  else throw new NotFoundError('Movie Genre not found!');
});

export const genresRouter = router;
