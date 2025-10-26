import {ErrorRequestHandler} from 'express';
import {HttpError} from '../errors/http.error';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res
      .status(err.code)
      .send({message: `Error: ${err.message}`, status: err.code});
  } else {
    console.error(err);
    res.status(500).send({error: `An unknownerror has occurred\n${err}`});
  }
};
