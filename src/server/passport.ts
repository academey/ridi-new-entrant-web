import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import passport from 'passport';
import {
  ExtractJwt as ExtractJWT,
  Strategy as JWTStrategy,
} from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { NextFunction, Request, Response } from 'express';
import { NOT_AUTHORIZED_ERROR } from 'server/routes/constants';
import userService from 'server/service/userService';
import { makeFailResponse } from 'server/utils/result';

export const BCRYPT_SALT_ROUNDS = 12;

const passportStrategy = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
      },
      async (email, password, cb) => {
        let user;
        try {
          user = await userService.findByEmail(email);
        } catch (err) {
          return cb(err);
        }

        if (!user) {
          return cb(null, false, { message: '해당 유저를 찾을 수 없습니다.' });
        }

        if (!user.authenticate(password)) {
          return cb(null, false, { message: '비밀번호가 틀렸습니다.' });
        }

        return cb(null, user);
      },
    ),
  );

  passport.use(
    'register',
    new LocalStrategy(
      {
        usernameField: 'email',
      },
      async (email, password, cb) => {
        let user;
        try {
          user = await userService.findByEmail(email);
          if (user) {
            return cb(null, false, { message: '해당 이메일은 누가 이미 썼음.' });
          }
          const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
          const createdUser = await userService.create(email, hashedPassword);

          return cb(null, createdUser);
        } catch (err) {
          return cb(err);
        }
      },
    ),
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwtPayload, cb) => {
        try {
          const user = await userService.findById(jwtPayload.id);
          return cb(null, user);
        } catch (err) {
          return cb(err);
        }
      },
    ),
  );
}

export default passportStrategy;

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = ExtractJWT.fromAuthHeaderAsBearerToken()(req);

    await jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return makeFailResponse(
      res,
      NOT_AUTHORIZED_ERROR,
      '토큰이 없거나 유효하지 않습니다.',
    );
  }

  return passport.authenticate('jwt', { session: false })(req, res, next);
}

// passport.serializeUser((user, cb) => {
//     // 로그인에 성공했을 때, user 식별자 값을 passport 내부 세션에 저장해둔다.
//     cb(null, user.id);
// });
//
// passport.deserializeUser(async (id, cb) => {
//     // 로그인에 성공하고 다른 곳에 방문할 때마다 저장해둔 식별자로 유저를 찾아서 준다.
//     // 이 데이터는 항상 request.user 에 주입해준다.
//     // 즉, request.user 를 통해 로그인했는지 아닌지 확인하면 된다.
//     let user;
//     try {
//         user = await models.User.findByPk(id);
//     } catch (err) {
//         return cb(err);
//     }
//     cb(null, user);
// });
