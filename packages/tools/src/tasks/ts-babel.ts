import * as path from 'path';
import * as ENV from '../config/env'
import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as babel from 'gulp-babel';
import * as merge from 'merge2';

gulp.task("ts-babel", function () {
	const tsProject = ts.createProject(path.join(ENV.ROOT, '/tsconfig.json'));
	const tsResults = tsProject.src()
		.pipe(tsProject());

	return merge([
		tsResults.js
			.pipe(babel())
			.pipe(gulp.dest(ENV.DIST_PATH)),
		tsResults.dts
			.pipe(gulp.dest(ENV.DIST_PATH))
	]);
});