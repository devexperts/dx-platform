#!/usr/bin/env node
'use strict';

const spawn = require('cross-spawn');
const args = process.argv.slice(2);

const scriptIndex = args.findIndex(
    x => x === 'build' || x === 'eject' || x === 'start' || x === 'test'
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

switch (script) {
	case 'watch-ts-transform':
    case 'build-ts-transform':
    case 'build-lib':
	case 'watch-build-lib':
    case 'storybook':
    case 'clean': {
	    require('babel-register');
	    require(require.resolve('../scripts/' + script));
        break;
    }
    default:
        console.log('Unknown script "' + script + '".');
        console.log('Perhaps you need to update @devexperts/tools?');
        break;
}