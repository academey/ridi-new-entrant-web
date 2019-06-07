import * as express from 'express';
import models from '../../database/models/index';

const router = express.Router();

router.route('/').get(async (req, res) => {
    const authors = await models.author.findAll();
    res.json(authors);
    // models.User.findAll().then( (result) => res.json(result) );
});

export default router;
