import * as dotenv from 'dotenv';
dotenv.config();

import * as express from 'express';
// Server middleware
import {errorHandler} from './handlers/error.handler';
// Routers
import {authRouter} from './routers/auth.router';
import {moviesRouter} from './routers/movies.router';
import {authenticationHandler} from './handlers/authentication.handler';
import {genresRouter} from './routers/genres.router';

const port = 3000;
const app = express();

app.use(express.json());

app.use('/api/auth', authRouter);

app.use(authenticationHandler);
// Authenticated routes
app.use('/api/movies', moviesRouter);
app.use('/api/genres', genresRouter);

// Keep at the bottom of routes
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
