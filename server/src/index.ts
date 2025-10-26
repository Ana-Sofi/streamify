import * as dotenv from 'dotenv';
dotenv.config();

import * as express from 'express';
// Server middleware
import {errorHandler} from './middleware/error-handler';
// Controllers
import moviesController from './controllers/movies.controller';

const port = 3000;
const app = express();

app.use(express.json());

app.use('/api/movies', moviesController);

// Keep at the bottom of routes
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
