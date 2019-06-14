import {NextFunction, Request, Response, Router} from 'express';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';

export class AuthRouter {
    constructor() {
        this.router = Router();
        this.init();
    }
    public router: Router;

    public register(req: any, res: Response, next: NextFunction) {
        passport.authenticate('register', {session: false}, (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({
                    info,
                    user,
                });
            }

            req.login(user, {session: false}, (loginError: any) => {
                if (loginError) {
                    res.send(loginError);
                }
                const token = jwt.sign(user.dataValues, process.env.JWT_SECRET);
                return res.json({user, token});
            });
        })(req, res);
    }

    public signIn(req: Request, res: Response, next: NextFunction) {
        passport.authenticate('local', {session: false}, (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({
                    info,
                    user,
                });
            }

            req.login(user, {session: false}, (err2) => {
                if (err2) {
                    res.send(err2);
                }
                const token = jwt.sign(user.dataValues, process.env.JWT_SECRET);
                return res.json({user, token});
            });
        })(req, res);
    }

    public signInTest(req: Request, res: Response, next: NextFunction) {
        passport.authenticate('local', { successRedirect: '/api/auth/success',
            failureRedirect: '/api/auth/sign_in_test' })(req, res, next);
    }

    public successTest(req: Request, res: Response, next: NextFunction) {
        console.log(req.user);
        res.json({
            test: 'test',
        });
    }

    public logout(req: any, res: Response, next: NextFunction) {
        req.logout();
        res.redirect('/api/auth/success');
    }

    public init() {
        this.router.post('/register', this.register);
        this.router.post('/sign_in', this.signIn);
        this.router.post('/sign_in_test', this.signInTest);
        this.router.get('/success', this.successTest);
        this.router.get('/logout', this.logout);
    }
}

const authRoutes = new AuthRouter();
authRoutes.init();

export default authRoutes.router;
