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

// body parsing
app.use(express.urlencoded({ extended: true }));

// render form
// use .all to handle initial GET and POST
app.all('/', (req, res, next) => {
	if (req.method === 'GET' || req.method === 'POST') {
		res.render('form', {
			title: `Parse HTTP ${req.method.toUpperCase()} data`,
			data: req.body,
		});
	} else {
		next();
	}
});

app.all('*', (req, res) => {
	res.redirect('/');
});

// start server
app.listen(config.port, () => {
	console.log(`App listening on port ${config.port}`);
});
