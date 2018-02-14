import * as gulp from 'gulp';

export const registerCopyStyusTask = (src: string, dist: string) => {
	return gulp.task("copy-stylus", function () {
		return gulp.src(`${src}/**/*.styl`)
			.pipe(gulp.dest(dist));
	});
};