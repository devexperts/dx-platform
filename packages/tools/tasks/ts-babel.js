import path from 'path';
import * as ENV from '../config/env'
import gulp from 'gulp';
import ts from 'gulp-typescript';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import merge from 'merge2';

gulp.task("ts-babel", function () {
	// Using my existing tsconfig.json file
	const tsProject = ts.createProject(path.join(ENV.ROOT, '/tsconfig.json'));
	const tsResults = gulp.src(`${ENV.SRC_PATH}/**/*.ts?(x)`, { base: "./src" })
		.pipe(tsProject());

	return merge([
		tsResults.js
			.pipe(babel())
			.pipe(gulp.dest(ENV.DIST_PATH)),
		tsResults.dts
			.pipe(gulp.dest(ENV.DIST_PATH))
	]);

	// // The `base` part is needed so
	// //  that `dest()` doesnt map folders correctly after rename
	// return gulp.src(`${ENV.SRC_PATH}/**/*.ts`, { base: "./" })
	// 	.pipe(tsProject())
	// 	// .pipe(babel())
	// 	.pipe(rename(function (path) {
	// 		path.extname = ".js";
	// 	}))
	// 	.pipe(gulp.dest(ENV.DIST_PATH));
});