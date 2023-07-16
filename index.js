import express from 'express';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, sep } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url)) + sep;

const app = express();

const config = {
	port: process.env.PORT || 3000,
	dir: {
		root: __dirname,
		static: __dirname + 'static' + sep,
		views: __dirname + 'views' + sep,
		routes: __dirname + 'routes' + sep,
	},
};

// use EJS templates
app.set('view engine', 'ejs');
app.set('views', config.dir.views);

// render form
app.get('/', (req, res) => {
	res.render('form', {
		title: 'Parse HTTP GET data',
		data: req.query,
	});
});

app.all('*', (req, res) => {
    res.redirect('/');
})

// start server
app.listen(config.port, () => {
    console.log(`App listening on port ${config.port}`);
})