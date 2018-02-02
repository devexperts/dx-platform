import {patchConsole} from '../utils/patchConsole';

patchConsole('build-ts-transform');

console.log('started');

process.argv = [];

require('typescript/bin/tsc');
