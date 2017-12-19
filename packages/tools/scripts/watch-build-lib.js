import gulp from 'gulp';
import watch from 'gulp-watch';
import batch from 'gulp-batch';
import {PKG, SRC_PATH} from '../config/env';
import {createLogger} from '../utils/logger';
import '../tasks/ts-babel';
import '../tasks/copy-stylus';

const log = createLogger(PKG.name, 'watch-build-lib');

log('Start watching...');

watch(`${SRC_PATH}/**/*`, batch(function(events, done) {
	log('Rebuild started....');
	gulp.start(['ts-babel', 'copy-stylus'], function(...args) {
		log('Rebuild completed');
		done()
	});
}));