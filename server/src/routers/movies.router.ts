import {Router} from 'express';
import {
  deleteMovie,
  getAllMovies,
  getMovieById,
  insertMovie,
  patchMovie,
} from '../repositories/movies.repository';
import {NotFoundError} from '../errors/not-found.error';
import {newMovieSchema} from '../validators/new-movie.schema';
import {Movie} from '../model/movie.model';
import {patchMovieSchema} from '../validators/patch-movie.schema';
import {idParamSchema} from '../validators/id-param.schema';
import {BadRequestError} from '../errors/bad-request.error';
import {newMovieGenreSchema} from '../validators/new-movie-genre.schema';
import {
  deleteMovieGenre,
  getMovieGenres,
  insertMovieGenre,
} from '../repositories/movie-genre.repository';
import {ForbiddenError} from '../errors/forbidden.error';
import {
  deleteMovieStaffByMovie,
  getMovieStaff,
  insertMovieStaff,
  patchMovieStaffByMovie,
} from '../repositories/movie-staff.repository';
import {newMovieStaffSchema} from '../validators/new-movie-staff.schema';
import {patchMovieStaffSchema} from '../validators/patch-movie-staff.schema';
import {deleteMovieStaffSchema} from '../validators/delete-movie-staff.schema';
import {authorize} from '../handlers/authorization.handler';

const router = Router();

router.get('/', async (req, res, next) => {
  const movies = await getAllMovies();

  res.status(200).send(movies);
});

router.get('/:id', async (req, res, next) => {
  const {id} = await idParamSchema.validate(req.params);

  const movie = await getMovieById(id);

  if (!movie) throw new NotFoundError('Movie not found!');
  res.status(200).send(movie);
});

router.post('/', authorize(['administrator']), async (req, res, next) => {
  const movie = (await newMovieSchema.validate(req.body)) as Movie;
  movie.scoreAverage = 0;
  movie.viewCount = 0;

  const rowsAltered = await insertMovie(movie);

  res.status(201).send({message: `Success: ${rowsAltered} rows created`});
});

router.patch('/:id', authorize(['administrator']), async (req, res, next) => {
  const movie = await patchMovieSchema.validate({
    ...req.body,
    id: req.params.id,
  });

  const rowsAltered = await patchMovie(movie);

  if (rowsAltered === -1)
    throw new BadRequestError('No fields to patch were given!');
  else if (rowsAltered > 0)
    res.status(200).send({message: `Success: ${rowsAltered} rows updated`});
  else throw new NotFoundError('Movie not found!');
});

router.delete('/:id', authorize(['administrator']), async (req, res, next) => {
  const {id} = await idParamSchema.validate(req.params);
  const rowsAltered = await deleteMovie(id);

  if (rowsAltered > 0)
    res.status(200).send({message: `Success: ${rowsAltered} rows deleted`});
  else throw new NotFoundError('Movie not found!');
});

router.get('/:id/genres', async (req, res, next) => {
  const {id} = await idParamSchema.validate(req.params);
  const genres = await getMovieGenres(id);

  res.status(200).send(genres);
});

router.post(
  '/:id/genres',
  authorize(['administrator']),
  async (req, res, next) => {
    const movieGenre = await newMovieGenreSchema.validate({
      ...req.body,
      movieId: req.params.id,
    });

    const rowsAltered = await insertMovieGenre(movieGenre);
    if (rowsAltered === 0) throw new NotFoundError('Movie or Genre not found!');
    else if (rowsAltered === -1)
      throw new ForbiddenError('Movie Genre already exists!');
    res.status(201).send({message: `Success ${rowsAltered} rows created`});
  },
);

router.delete(
  '/:id/genres',
  authorize(['administrator']),
  async (req, res, next) => {
    const movieGenre = await newMovieGenreSchema.validate({
      ...req.body,
      movieId: req.params.id,
    });
    const rowsAltered = await deleteMovieGenre(movieGenre);

    if (rowsAltered > 0)
      res.status(200).send({message: `Success: ${rowsAltered} rows deleted`});
    else throw new NotFoundError('Movie Genre not found!');
  },
);

router.get('/:id/staff', async (req, res, next) => {
  const {id} = await idParamSchema.validate(req.params);
  const staff = await getMovieStaff(id);

  res.status(200).send(staff);
});

router.post(
  '/:id/staff',
  authorize(['administrator']),
  async (req, res, next) => {
    const movieStaff = await newMovieStaffSchema.validate({
      ...req.body,
      movieId: req.params.id,
    });

    const rowsAltered = await insertMovieStaff(movieStaff);
    if (rowsAltered === 0)
      throw new NotFoundError('Movie or Staff Member not found!');
    else if (rowsAltered === -1)
      throw new ForbiddenError('Movie Staff already exists!');
    res.status(201).send({message: `Success: ${rowsAltered} rows created`});
  },
);

router.patch(
  '/:id/staff',
  authorize(['administrator']),
  async (req, res, next) => {
    const movieStaff = await patchMovieStaffSchema.validate({
      ...req.body,
      movieId: req.params.id,
    });
    const rowsAltered = await patchMovieStaffByMovie(movieStaff);

    if (rowsAltered === 0) throw new NotFoundError('Movie Staff not found!');
    else
      res.status(200).send({message: `Success: ${rowsAltered} rows updated`});
  },
);

router.delete(
  '/:id/staff',
  authorize(['administrator']),
  async (req, res, next) => {
    const movieStaff = await deleteMovieStaffSchema.validate({
      ...req.body,
      movieId: req.params.id,
    });
    const rowsAltered = await deleteMovieStaffByMovie(movieStaff);

    if (rowsAltered > 0)
      res.status(200).send({message: `Success: ${rowsAltered} rows deleted`});
    else throw new NotFoundError('Movie Staff not found!');
  },
);

export const moviesRouter: Router = router;
