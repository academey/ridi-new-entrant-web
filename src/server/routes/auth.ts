import { Request, Response, Router } from 'express';
import * as jwt from 'jsonwebtoken';
import passport from 'passport';

import { User } from 'database/models/user';
import { assertAll, email, presence } from 'property-validator';
import { isAuthenticated } from 'server/passport';
import { makeFailResponse, makeSuccessResponse } from 'server/utils/result';

export class AuthRouter {
  constructor() {
    this.router = Router();
    this.init();
  }
  public router: Router;

  public register(req: Request, res: Response) {
    assertAll(req, [email('email'), presence('password')]);

    passport.authenticate(
      'register',
      { session: false },
      (err: Error, user: User, info) => {
        if (err) {
          return res.status(500).json(makeFailResponse(err.message));
        }
        if (!user || info) {
          return res.status(400).json(makeFailResponse(info.message));
        }

        req.login(user, { session: false }, (loginError: Error) => {
          if (loginError) {
            return res.status(500).json(makeFailResponse(loginError.message));
          }

          const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
          return res
            .status(201)
            .json(makeSuccessResponse({ user, token }, '가입 성공했습니다.'));
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
          return res.status(500).json(makeFailResponse(err.message));
        }
        if (!user || info) {
          return res.status(400).json(makeFailResponse(info.message));
        }

        req.login(user, { session: false }, (loginError: Error) => {
          if (loginError) {
            return res.status(500).json(makeFailResponse(loginError.message));
          }
          const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
          return res
            .status(200)
            .json(makeSuccessResponse({ user, token }, '로그인 성공했습니다.'));
        });
      },
    )(req, res);
  }

  public loginCheck(req: Request, res: Response) {
    const { user } = req;

    return res.status(200).json(makeSuccessResponse({ user }, '로그인 성공~'));
  }

  public init() {
    this.router.post('/register', this.register);
    this.router.post('/login', this.login);
    this.router.get('/login_check', isAuthenticated, this.loginCheck);
  }
}

const authRoutes = new AuthRouter();
authRoutes.init();

export default authRoutes.router;
