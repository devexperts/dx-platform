import {DIST_PATH, PKG} from '../config/env';
import * as rimraf from 'rimraf';
import {patchConsole} from '../utils/patchConsole';

patchConsole('clean');

rimraf(DIST_PATH, (...args) => {
	console.log(`removed: ${DIST_PATH}`)
});

