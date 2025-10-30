import * as jose from 'jose';
import {RequestHandler} from 'express';
import {UnauthorizedError} from '../errors/unauthorized.error';
import {AccessTokenPayload} from '../lib/token';
import {getProfileById} from '../repositories/profiles.repository';
import {HttpError} from '../errors/http.error';
import {Profile} from '../model/profile.model';
import {Optional} from '../lib/optional';

export const authenticationHandler: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    throw new UnauthorizedError('Missing or invalid token!');

  const [, accessToken] = authHeader.split(' ');
  const secret = new TextEncoder().encode(process.env.SIGNING_SECRET);
  let payload: AccessTokenPayload;
  try {
    const result = (await jose.jwtVerify(accessToken, secret)) as {
      payload: AccessTokenPayload;
    };
    payload = result.payload;
  } catch (err) {
    if (
      err instanceof jose.errors.JWTExpired ||
      err instanceof jose.errors.JWSInvalid ||
      err instanceof jose.errors.JWSSignatureVerificationFailed
    )
      throw new UnauthorizedError('Invalid token!');
    throw err;
  }

  const profile = await getProfileById(payload.profileId);
  if (!profile) {
    console.error('Error: Authentication attempt by non existing profile!');
    throw new HttpError(500);
  }
  console.debug(profile);
  req.user = profile;
  delete (req.user as Optional<Profile, 'password'>).password;

  next();
};

export const authenticate: RequestHandler = authenticationHandler;
