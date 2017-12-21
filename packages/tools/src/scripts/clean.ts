import {DIST_PATH, PKG} from '../config/env';
import * as rimraf from 'rimraf';
import {createLogger} from '../utils/logger';

const log = createLogger(PKG.name, 'clean');

log('started');

rimraf(DIST_PATH, (...args) => {
	log(`removed: ${DIST_PATH}`)
});

