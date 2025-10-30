import {Router} from 'express';
import * as argon2 from 'argon2';
import * as jose from 'jose';
import {UnauthorizedError} from '../errors/unauthorized.error';
import {credentialsSchema} from '../validators/credentials.schema';
import {
  deleteProfile,
  getProfileByEmail,
  insertProfile,
  patchProfile,
} from '../repositories/profiles.repository';
import {NotFoundError} from '../errors/not-found.error';
import {newProfileSchema} from '../validators/new-profile.schema';
import {ForbiddenError} from '../errors/forbidden.error';
import {authenticate} from '../handlers/authentication.handler';
import {patchProfileSchema} from '../validators/patch-profile.schema';
import {BadRequestError} from '../errors/bad-request.error';

const router: Router = Router();

router.post('/register', async (req, res, next) => {
  const profile = await newProfileSchema.validate(req.body);
  profile.password = await argon2.hash(profile.password);

  const result = await insertProfile(profile);

  if (result === -1)
    throw new ForbiddenError(
      `The account with email ${profile.email} already exists!`,
    );
  res.status(201).send({message: 'Success: profile created'});
});

router.post('/login', async (req, res, next) => {
  const credentials = await credentialsSchema.validate(req.body);
  const profile = await getProfileByEmail(credentials.email);

  if (
    !profile ||
    !(await argon2.verify(profile.password, credentials.password))
  )
    throw new UnauthorizedError('Email or password is incorrect');

  // Never use long lived access tokens
  // Use safer implementations like refresh tokens, nonce, etc.
  // This is for the sake of simplicity
  const secret = new TextEncoder().encode(process.env.SIGNING_SECRET);
  const accessToken = await new jose.SignJWT({profileId: profile.id})
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret);

  res.status(200).send({accessToken});
});

router.get('/me', authenticate, (req, res, next) => {
  res.status(200).send(req.user);
});

router.patch('/me', authenticate, async (req, res, next) => {
  const profile = await patchProfileSchema.validate({
    ...req.body,
    id: req.user.id,
  });
  const rowsAltered = await patchProfile(profile);

  if (rowsAltered === -1)
    throw new BadRequestError('No fields to patch were given!');
  else if (rowsAltered > 0)
    res.status(200).send({message: `Success: ${rowsAltered} rows updated`});
  else throw new NotFoundError('Profile not found!');
});

router.delete('/me', authenticate, async (req, res, next) => {
  const rowsAltered = await deleteProfile(req.user.id);

  if (rowsAltered > 0)
    res.status(200).send({message: `Success: ${rowsAltered} rows deleted`});
  else throw new NotFoundError('Profile not found!');
});

export const authRouter = router;
