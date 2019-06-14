import {NextFunction, Request, Response, Router} from 'express';
import {Book} from '../../database/models/Book';
import {BookReservation} from '../../database/models/BookReservation';
import {isAuthenticated} from '../passport';

export class BookRouter {
    constructor() {
        this.router = Router();
        this.init();
    }
    public router: Router;

    public async createOne(req: Request, res: Response, next: NextFunction) {
        const { name , desc} = req.body;
        const book = await Book.create({
            name,
            desc,
        });

        res.status(200)
            .send({
                message: 'Success',
                status: res.status,
                book,
            });
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        const books = await Book.findAll({ include: [ BookReservation ] });
        res.status(200)
            .send({
                message: 'Success',
                status: res.status,
                books,
            });
    }

    public async getOne(req: Request, res: Response, next: NextFunction) {
        const query = parseInt(req.params.id, 10);
        const book = await Book.findByPk(query);
        if (book) {
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status,
                    book,
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
            const destroyedCount = await Book.destroy({
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

    public async borrow(req: any, res: Response, next: NextFunction) {
        const { bookId, endAt } = req.body;
        const userId = req.User.id;
        const bookReservation = await BookReservation.findOne({
            where: {
                bookId,
            },
        });
        if (bookReservation) {
            return res.status(404)
                .send({
                    message: `Already reserved by ${bookReservation.userId}`,
                    status: res.status,
                });
        }

        const createdBookReservation = await BookReservation.create({
            userId,
            bookId,
            endAt,
        });

        // const book = await Book.findByPk(query);
        if (createdBookReservation) {
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status,
                    createdBookReservation,
                });
        } else {
            res.status(404)
                .send({
                    message: 'No hero found with the given id.',
                    status: res.status,
                });
        }
    }

    public async return(req: any, res: Response, next: NextFunction) {
        const { bookId } = req.body;
        const userId = req.User.id;
        const bookReservation = await BookReservation.findOne({
            where: {
                bookId,
            },
        });
        if (!bookReservation) {
            return res.status(404)
                .send({
                    message: `The reservation doesn't exist `,
                    status: res.status,
                });
        } else if (bookReservation.userId !== userId) {
            return res.status(401)
                .send({
                    message: `The reservation doesn't borrowed by me`,
                    status: res.status,
                });
        }

        const deletedBookReservation = await BookReservation.destroy({
            where: {
                userId,
                bookId,
            },
        });

        if (deletedBookReservation) {
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status,
                    deletedBookReservation,
                });
        } else {
            res.status(404)
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

        this.router.post('/borrow', isAuthenticated, this.borrow);
        this.router.post('/return', isAuthenticated, this.return);
    }
}

const bookRoutes = new BookRouter();
bookRoutes.init();

export default bookRoutes.router;
