import { NextFunction, Request, Response, Router } from 'express';

import { isAuthenticated } from '../passport';

export class AccountRouter {
  constructor() {
    if (AccountRouter.instance) {
      return AccountRouter.instance;
    }
    AccountRouter.instance = this;
    this.router = Router();
    this.init();
  }

  public static instance: AccountRouter;
  public router: Router;

  public profile(req: any, res: Response, next: NextFunction) {
    res.json({
      profile: 'profile',
    });
  }

  public init() {
    this.router.use('', isAuthenticated);
    this.router.get('/profile', this.profile);
  }
}

const accountRoutes = new AccountRouter();

export default accountRoutes.router;
