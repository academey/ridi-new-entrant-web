import author from './author';

const PREFIX = '/api';

export default function(app) {
    app.use(PREFIX + '/author', author);

    app.get('/', (req, res) => {
        res.render('index.js.ts.html');
    });
}
