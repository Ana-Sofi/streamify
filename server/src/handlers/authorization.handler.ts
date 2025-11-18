import {RequestHandler} from 'express';
import {ForbiddenError} from '../errors/forbidden.error';
import {Role} from '../model/role.model';

export const authorizationHandler =
  (authorizedRoles: Role[]): RequestHandler =>
  (req, res, next) => {
    if (authorizedRoles.includes(req.user.role)) next();
    else throw new ForbiddenError("You're not allowed to perform this action!");
  };

export const authorize = authorizationHandler;
