import {DIST_PATH} from '../config/env';
import * as rimraf from 'rimraf';
import {patchConsole} from '../utils/patchConsole';

patchConsole('clean');

rimraf(DIST_PATH, () => {
	console.log(`removed: ${DIST_PATH}`)
});

