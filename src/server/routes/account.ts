import { NextFunction, Request, Response, Router } from 'express';

import { isAuthenticated } from '../passport';

const profile = (req: any, res: Response, next: NextFunction) => {
  res.json({
    profile: 'profile',
  });
};

const router = Router();
router.use('', isAuthenticated);
router.get('/profile', profile);

export default router;
