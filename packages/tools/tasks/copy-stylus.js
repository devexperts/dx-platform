import path from 'path';
import * as ENV from '../config/env'
import gulp from 'gulp';

gulp.task("copy-stylus", function () {
	// // Using my existing tsconfig.json file
	// const tsProject = ts.createProject(path.join(ENV.ROOT, '/tsconfig.json'));
	// const tsResults = gulp.src(`${ENV.SRC_PATH}/**/*.ts?(x)`, { base: "./src" })
	// 	.pipe(tsProject());
	//
	// return merge([
	// 	tsResults.js
	// 		.pipe(babel())
	// 		.pipe(gulp.dest(ENV.DIST_PATH)),
	// 	tsResults.dts
	// 		.pipe(gulp.dest(ENV.DIST_PATH))
	// ]);

	return gulp.src(`${ENV.SRC_PATH}/**/*.styl`, {base: './src'})
		.pipe(gulp.dest(ENV.DIST_PATH));
});