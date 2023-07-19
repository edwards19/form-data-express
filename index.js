import express from 'express';
import compression from 'compression';
import formidable from 'formidable';
import { fileURLToPath } from 'url';
import { dirname, parse, sep } from 'path';
import { deleteFiles } from './middleware/deleteFiles.js';

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

// delete uploads files if 24 hours have passed
app.use(deleteFiles);

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
			if (err) {
				next(err);
				return;
			}
			if (files && files.image && files.image[0].size > 0) {
				data.filename = files.image[0].originalFilename;
				data.filetype = files.image[0].mimetype;
				data.filesize = Math.ceil(files.image[0].size / 1024) + ' KB';
				data.uploadto = files.image[0].filepath;
				data.imageurl = '/' + parse(files.image[0].filepath).base;
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

export {config};