import * as ENV from '../config/env'
import * as gulp from 'gulp';

gulp.task("copy-stylus", function () {
	return gulp.src(`${ENV.SRC_PATH}/**/*.styl`, {base: './src'})
		.pipe(gulp.dest(ENV.DIST_PATH));
});