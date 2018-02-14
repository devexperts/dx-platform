import * as gulp from 'gulp';
import * as watch from 'gulp-watch';
import * as batch from 'gulp-batch';
import { PKG, SRC_PATH } from '../config/env';
import '../tasks/ts-babel';
import '../tasks/copy-stylus';

import { Command } from 'commander';

const program = new Command();

program
	.version(PKG.version)
	.command('watch-build-lib')
	.action(function() {
		console.log(`Watching library "${PKG.name}"`);

		watch(`${SRC_PATH}/**/*`, batch(function(events, done) {
			console.log('Rebuild started....');
			gulp.start(['ts-babel', 'copy-stylus'], function() {
				console.log('Rebuild completed');
				done()
			});
		}));
	});


program.parse(process.argv);
