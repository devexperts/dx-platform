import * as gulp from 'gulp';

export const registerCopyFilesTask = (src: string, dist: string) => {
	return gulp.task("copy-files", function () {
		return gulp.src(`${src}/**/!(*.ts|*.tsx|*.icon.svg)`)
			.pipe(gulp.dest(dist));
	});
};