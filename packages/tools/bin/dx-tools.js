#!/usr/bin/env node
'use strict';

const args = process.argv.slice(2);

const script = args[0];

switch (script) {
	case 'watch-ts-transform':
    case 'build-ts-transform':
    case 'build-lib':
	case 'watch-build-lib':
    case 'storybook':
	case 'dev-server':
    case 'clean': {
	    require(require.resolve('../lib/scripts/' + script));
        break;
    }
    default:
        console.log('Unknown script "' + script + '".');
        console.log('Perhaps you need to update @devexperts/tools?');
        break;
}