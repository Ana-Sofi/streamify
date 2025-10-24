import * as dotenv from 'dotenv';
dotenv.config();

import * as express from 'express';
import moviesController from './controllers/movies.controller';
import {errorHandler} from './middleware/error-handler';

const port = 3000;
const app = express();

app.use(express.json());

app.use('/movies', moviesController);

// Keep at the bottom of routes
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`); //para imprimir texto en pantalla
}); // para inicializar el servidor y saber si ya arrancó
