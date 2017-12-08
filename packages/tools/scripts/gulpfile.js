import path from 'path';
import * as ENV from '../config/env'
import gulp from 'gulp';
import ts from 'gulp-typescript';
import babel from 'gulp-babel';
import rename from 'gulp-rename';

gulp.task("ts-babel", function () {
	// Using my existing tsconfig.json file
	const tsProject = ts.createProject(path.join(ENV.ROOT, '/tsconfig.json'));

	// The `base` part is needed so
	//  that `dest()` doesnt map folders correctly after rename
	return gulp.src(`${ENV.SRC_PATH}/**/*.ts`, { base: "./" })
		.pipe(ts(tsProject))
		.pipe(babel())
		.pipe(rename(function (path) {
			path.extname = ".js";
		}))
		.pipe(gulp.dest("."));
});