import path from 'path';
import * as ENV from '../config/env'
import gulp from 'gulp';
import ts from 'gulp-typescript';
import babel from 'gulp-babel';
import merge from 'merge2';

gulp.task("ts-babel", function () {
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
});