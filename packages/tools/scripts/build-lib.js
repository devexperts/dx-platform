import gulp from 'gulp';
import {PKG} from '../config/env';
import {createLogger} from '../utils/logger';
import '../tasks/ts-babel';

const log = createLogger(PKG.name, 'build-lib');

log('Starting prod...');

gulp.start('ts-babel');


