import { ACCESS_TOKEN_KEY } from 'client/utils/storage';
import { User } from 'database/models/User';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';

export default function addTokenToResponse(res: Response, user: User): string {
  const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
    expiresIn: 600,
  });
  res.cookie(ACCESS_TOKEN_KEY, token);

  return token;
}
