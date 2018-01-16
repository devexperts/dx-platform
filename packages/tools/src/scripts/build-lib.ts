import * as gulp from 'gulp';
import '../tasks/ts-babel';
import '../tasks/copy-stylus';

import {patchConsole} from '../utils/patchConsole';

patchConsole('build-lib');
console.log('Starting prod...');

gulp.start(['ts-babel', 'copy-stylus']);


