import express from 'express';
import compression from 'compression';
import formidable from 'formidable';
import { fileURLToPath } from 'url';
import { dirname, parse, sep } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url)) + sep;

const app = express();

const config = {
	port: process.env.PORT || 3000,
	dir: {
		root: __dirname,
		views: __dirname + 'views' + sep,
		routes: __dirname + 'routes' + sep,
		uploads: __dirname + 'uploads' + sep,
	},
};

app.use(compression());

// use EJS templates
app.set('view engine', 'ejs');
app.set('views', config.dir.views);

// static assets
app.use(express.static( config.dir.uploads ));

// body parsing
// app.use(express.urlencoded({ extended: true })); we don't need this middleware since we use formidable

// render form
// use .all to handle initial GET and POST
app.all('/', (req, res, next) => {
	if (req.method === 'GET' || req.method === 'POST') {
		// parse uploaded file data
		const form = formidable({
			uploadDir: config.dir.uploads,
			keepExtensions: true,
		});
		form.parse(req, (err, data, files) => {
			console.log('data here', data);
			if (err) {
				next(err);
				return;
			}
			if (files && files.image && files.image.size > 0) {
				data.filename = files.image.originalFilename;
				data.filetype = files.image.mimetype;
				data.filesize = Math.ceil(files.image.size / 1024) + ' KB';
				data.uploadto = files.image.filepath;
				data.imageurl = '/' + parse(files.image.filepath).base;
			}
			res.render('form', { title: 'Parse HTTP POST file data', data });
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
