import { Request, Response, Router } from 'express';
import * as jwt from 'jsonwebtoken';
import passport from 'passport';

import { ACCESS_TOKEN_KEY } from 'client/utils/storage';
import { User } from 'database/models/User';
import { assertAll, email, presence } from 'property-validator';
import { isAuthenticated } from 'server/passport';
import {
  CLIENT_ERROR,
  CREATED_CODE,
  SERVER_ERROR,
  SUCCESS_CODE,
} from 'server/routes/constants';
import {
  makeFailJson,
  makeFailResponse,
  makeSuccessJson,
  makeSuccessResponse,
} from 'server/utils/result';
import createToken from 'server/utils/createToken';

export class AuthRouter {
  public static router: Router = Router();
  public static getInstance() {
    return this.router;
  }

  public register(req: Request, res: Response) {
    assertAll(req, [email('email'), presence('password')]);

    passport.authenticate(
      'register',
      { session: false },
      (err: Error, user: User, info) => {
        if (err) {
          return makeFailResponse(res, SERVER_ERROR, err.message);
        }
        if (!user || info) {
          return makeFailResponse(res, CLIENT_ERROR, info.message);
        }

        req.login(user, { session: false }, (loginError: Error) => {
          if (loginError) {
            return makeFailResponse(res, SERVER_ERROR, loginError.message);
          }

          const token = createToken(user);

          return makeSuccessResponse(
            res.cookie('access_token', token),
            CREATED_CODE,
            { user, token },
            '가입 성공했습니다.',
          );
        });
      },
    )(req, res);
  }

  public login(req: Request, res: Response) {
    assertAll(req, [email('email'), presence('password')]);

    passport.authenticate(
      'local',
      { session: false },
      (err: Error, user: User, info) => {
        if (err) {
          return makeFailResponse(res, SERVER_ERROR, err.message);
        }
        if (!user || info) {
          return makeFailResponse(res, CLIENT_ERROR, info.message);
        }

        req.login(user, { session: false }, (loginError: Error) => {
          if (loginError) {
            return makeFailResponse(res, SERVER_ERROR, loginError.message);
          }
          const token = createToken(user);

          return makeSuccessResponse(
            res.cookie(ACCESS_TOKEN_KEY, token),
            SUCCESS_CODE,
            { user, token },
            '로그인 성공했습니다.',
          );
        });
      },
    )(req, res);
  }

  public loginCheck(req: Request, res: Response) {
    const { user } = req;

    return res
      .status(SUCCESS_CODE)
      .json(makeSuccessJson({ user }, '로그인 성공~'));
  }

  public init(router: Router) {
    router.post('/register', this.register);
    router.post('/login', this.login);
    router.get('/login_check', isAuthenticated, this.loginCheck);
  }
}

const authRoutes = new AuthRouter();
const authRouter = AuthRouter.getInstance();
authRoutes.init(authRouter);

export default authRouter;
