import * as express from 'express';
import models from '../../database/models/index';

const router = express.Router();

router.route('/').get(async (req, res) => {
    const books = await models.book.findAll();
    res.json(books);
});

export default router;
