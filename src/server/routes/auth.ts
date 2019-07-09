import { Request, Response, Router } from 'express';
import passport from 'passport';

import { User } from 'database/models/User';
import { assertAll, email, presence } from 'property-validator';
import { isAuthenticated } from 'server/passport';
import {
  CLIENT_ERROR,
  CREATED_CODE,
  SERVER_ERROR,
  SUCCESS_CODE,
} from 'server/routes/constants';
import addTokenToResponse from 'server/utils/addTokenToResponse';
import {
  makeFailResponse,
  makeSuccessJson,
  makeSuccessResponse,
} from 'server/utils/result';

class AuthRouter {
  constructor() {
    if (AuthRouter.instance) {
      return AuthRouter.instance;
    }
    AuthRouter.instance = this;
    this.router = Router();
    this.init();
  }

  public static instance: AuthRouter;
  public router: Router;

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

          addTokenToResponse(res, user);

          return makeSuccessResponse(
            res,
            CREATED_CODE,
            { user },
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

          addTokenToResponse(res, user);

          return makeSuccessResponse(
            res,
            SUCCESS_CODE,
            { user },
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

  public init() {
    this.router.post('/register', this.register);
    this.router.post('/login', this.login);
    this.router.get('/login_check', isAuthenticated, this.loginCheck);
  }
}

const authRoutes = new AuthRouter();

export default authRoutes.router;
