import { ROOT } from '../config/env'
import * as gulp from 'gulp';
import * as path from "path";

export const registerCopyStyusTask = (src: string, dist: string) => {
	return gulp.task("copy-stylus", function () {
		const SRC_PATH = path.join(ROOT, src);
		const DIST_PATH = path.join(ROOT, dist);

		return gulp.src(`${SRC_PATH}/**/*.styl`, {base: `./${src}`})
			.pipe(gulp.dest(DIST_PATH));
	});
};