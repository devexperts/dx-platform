import * as gulp from 'gulp';
import { registerTSBabelTask } from '../tasks/ts-babel';
import { registerCopyStyusTask } from '../tasks/copy-stylus';
import * as watch from 'gulp-watch';
import * as batch from 'gulp-batch';
import { getProgramForScript } from '../utils/program';
import { Scripts } from './constants';
import { PKG, ROOT } from '../config/env';
import * as path from 'path';

const program = getProgramForScript(Scripts.BUILD_LIB);

program
	.command('build-lib <src> <dist>')
	.option('-w, --watch', 'start in watch mode')
	.action(function(src, dist, options) {
		const SRC_PATH = path.join(ROOT, src);
		const DIST_PATH = path.join(ROOT, dist);

		registerTSBabelTask(SRC_PATH, DIST_PATH);
		registerCopyStyusTask(SRC_PATH, DIST_PATH);


		if (options.watch) {
			console.log(`Watching library "${PKG.name}"`);

			gulp.start(['ts-babel', 'copy-stylus']);

			watch(`${SRC_PATH}/**/*`, batch(function(events, done) {
				console.log('Rebuild started....');

				gulp.start(['ts-babel', 'copy-stylus'], function() {
					console.log('Rebuild completed');
					done()
				});
			}));
		} else {
			console.log(`Building library "${PKG.name}"`);
			gulp.start(['ts-babel', 'copy-stylus']);
		}
	});


program.parse(process.argv);
