import * as jose from 'jose';
import {RequestHandler} from 'express';
import {UnauthorizedError} from '../errors/unauthorized.error';
import {AccessTokenPayload} from '../lib/token';
import {getProfileById} from '../repositories/profiles.repository';
import {HttpError} from '../errors/http.error';
import {AuthenticatedProfile, Profile} from '../model/profile.model';
import {Optional} from '../lib/optional';
import {Role} from '../model/role.model';

const adminUsers = ['admin.user@streamify.com'];
function getUserRole(email: string): Role {
  if (adminUsers.includes(email)) return 'administrator';
  return 'regular';
}

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
  req.user = profile as unknown as AuthenticatedProfile;
  delete (req.user as Optional<Profile, 'password'>).password;
  req.user.role = getUserRole(req.user.email);

  next();
};

export const authenticate: RequestHandler = authenticationHandler;
