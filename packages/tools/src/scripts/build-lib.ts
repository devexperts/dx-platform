import * as gulp from 'gulp';
import {PKG} from '../config/env';
import {createLogger} from '../utils/logger';
import '../tasks/ts-babel';
import '../tasks/copy-stylus';

const log = createLogger(PKG.name, 'build-lib');

log('Starting prod...');

gulp.start(['ts-babel', 'copy-stylus']);


