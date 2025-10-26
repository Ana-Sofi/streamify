import {Router} from 'express';
import {
  deleteMovie,
  getAllMovies,
  getMovie,
  insertMovie,
  patchMovie,
} from '../repositories/movies.repository';
import {NotFoundError} from '../errors/not-found.error';
import {newMovieSchema} from '../validators/new-movie.schema';
import {Movie} from '../model/movie.model';
import {patchMovieSchema} from '../validators/patch-movie.schema';
import {Id} from '../model/id.model';
import {idParamSchema} from '../validators/id-param.schema';
import {BadRequestError} from '../errors/bad-request.error';

const router = Router();

router.get('/', async (req, res, next) => {
  const movies = await getAllMovies();

  res.send(movies);
});

router.get('/:id', async (req, res, next) => {
  const {id} = await idParamSchema.validate(req.params);

  const movie = await getMovie(id);

  if (!movie) throw new NotFoundError('Movie not found!');
  res.send(movie);
});

router.post('/', async (req, res, next) => {
  const movie = (await newMovieSchema.validate(req.body)) as Movie;
  movie.scoreAverage = 0;
  movie.viewCount = 0;

  const rowsAltered = await insertMovie(movie);

  res.status(201).send({message: `Success: ${rowsAltered} rows created`});
});

router.patch('/:id', async (req, res, next) => {
  const movie = (await patchMovieSchema.validate({
    ...req.body,
    id: req.params.id,
  })) as Id<Partial<Movie>>;

  const rowsAltered = await patchMovie(movie);

  if (rowsAltered === -1)
    throw new BadRequestError('No fields to patch were given!');
  else if (rowsAltered > 0)
    res.status(200).send({message: `Success: ${rowsAltered} rows updated`});
  else throw new NotFoundError('Movie not found!');
});

router.delete('/:id', async (req, res, next) => {
  const {id} = await idParamSchema.validate(req.params);
  const rowsAltered = await deleteMovie(id);

  if (rowsAltered > 0)
    res.status(200).send({message: `Success: ${rowsAltered} rows deleted`});
  else throw new NotFoundError('Movie not found!');
});

export const moviesRouter: Router = router;
