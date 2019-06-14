import {NextFunction, Request, Response, Router} from 'express';

import {Author} from '../../database/models/Author';

export class AuthorRouter {
    constructor() {
        this.router = Router();
        this.init();
    }
    public router: Router;

    public async createOne(req: Request, res: Response, next: NextFunction) {
        const { name , desc} = req.body;
        const author = await Author.create({
            name,
            desc,
        });

        res.status(200)
            .send({
                message: 'Success',
                status: res.status,
                author,
            });
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        const authors = await Author.findAll();
        res.status(200)
            .send({
                message: 'Success',
                status: res.status,
                authors,
            });
    }

    public async getOne(req: Request, res: Response, next: NextFunction) {
        const query = parseInt(req.params.id, 10);
        const author = await Author.findByPk(query);
        if (author) {
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status,
                    author,
                });
        } else {
            res.status(404)
                .send({
                    message: 'No hero found with the given id.',
                    status: res.status,
                });
        }
    }

    public async deleteOne(req: Request, res: Response, next: NextFunction) {
        const query = parseInt(req.params.id, 10);
        try {
            const destroyedCount = await Author.destroy({
                where: {
                    id: query,
                },
            });
            if (destroyedCount === 0) {
                return res.status(404)
                    .send({
                        message: 'No hero found with the given id.',
                        status: res.status,
                    });
            }

            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status,
                });
        } catch (err) {
            res.status(500)
                .send({
                    message: 'No hero found with the given id.',
                    status: res.status,
                });
        }
    }

    public init() {
        this.router.post('/', this.createOne);
        this.router.get('/', this.getAll);
        this.router.get('/:id', this.getOne);
        this.router.delete('/:id', this.deleteOne);
    }
}

const authorRoutes = new AuthorRouter();
authorRoutes.init();

export default authorRoutes.router;
