import {patchConsole} from '../utils/patchConsole';

patchConsole('watch-ts-transform');

console.log('started');
process.argv = ['-w'];

require('typescript/bin/tsc');