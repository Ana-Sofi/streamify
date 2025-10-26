import {ValidationError} from 'yup';
import {ErrorRequestHandler} from 'express';
import {HttpError} from '../errors/http.error';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    res
      .status(400)
      .send({message: `Error: The following is invalid`, invalid: err.errors});
  } else if (err instanceof HttpError) {
    res
      .status(err.code)
      .send({message: `Error: ${err.message}`, status: err.code});
  } else {
    console.error(err);
    res.status(500).send({error: `An unknownerror has occurred\n${err}`});
  }
};
