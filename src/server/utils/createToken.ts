import { User } from 'database/models/User';
import * as jwt from 'jsonwebtoken';

export default function createToken(user: User) {
  return jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
    expiresIn: 60,
  });
}
