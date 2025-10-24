import {Router} from 'express';
import {fetchAllMovies, getMovieById} from '../repositories/movie.repository';
import {NotFoundError} from '../errors/not-found.error';

const router: Router = Router();

router.get('/', async (req, res, next) => {
  const movies = await fetchAllMovies();

  res.send(movies);
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;

  const movie = await getMovieById(id);

  if (!movie) throw new NotFoundError('Movie not found!');
  res.send(movie);
});

router.post('/', async (req, res, next) => {});

export default router;
