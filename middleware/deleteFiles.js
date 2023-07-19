import { readdir, stat, unlink, } from 'fs';
import { config } from '../index.js';

export const deleteFiles = (req, res, next) => {
	readdir(config.dir.uploads, (err, files) => {

        files.forEach((file, index) => {
            stat(`${config.dir.uploads}/${file}`, (err, stats) => {
				const creationTime = +stats.birthtimeMs.toString();
                const currentTime = Date.now();
				
				function has24HoursElapsed() {
					const timeDiff = currentTime - creationTime;
                    const twentyFourHrs = 24 * 60 * 60 * 1000
                    return timeDiff >= 60 * 1000;
				}

				if (has24HoursElapsed()) {
				    unlink(`${config.dir.uploads}/${file}`, err => {
				        if (err) throw err;
				        console.log(`${config.dir.uploads}${file} was deleted`);
				    })
				}
			});
        })

		
	});
	next();
};
