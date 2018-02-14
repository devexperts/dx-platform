import * as path from 'path';
import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as babel from 'gulp-babel';
import * as merge from 'merge2';
import { ROOT } from '../config/env';

export const registerTSBabelTask = (src: string, dist: string) => {
	return gulp.task("ts-babel", function () {
		const tsProject = ts.createProject(path.join(ROOT, '/tsconfig.json'));
		const tsResults = tsProject.src()
			.pipe(tsProject());

		return merge([
			tsResults.js
				.pipe(babel())
				.pipe(gulp.dest(dist)),
			tsResults.dts
				.pipe(gulp.dest(dist))
		]);
	});
};