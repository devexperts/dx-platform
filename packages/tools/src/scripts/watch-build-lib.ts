import * as gulp from 'gulp';
import * as watch from 'gulp-watch';
import * as batch from 'gulp-batch';
import {SRC_PATH} from '../config/env';
import '../tasks/ts-babel';
import '../tasks/copy-stylus';
import {patchConsole} from '../utils/patchConsole';

patchConsole('watch-build-lib');
console.log('Start watching...');

watch(`${SRC_PATH}/**/*`, batch(function(events, done) {
    console.log('Rebuild started....');
	gulp.start(['ts-babel', 'copy-stylus'], function() {
        console.log('Rebuild completed');
		done()
	});
}));