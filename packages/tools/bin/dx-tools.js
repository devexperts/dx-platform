#!/usr/bin/env node
'use strict';

const [node, commmand, script, ...restArgs] = process.argv;

process.argv = [node, commmand, ...restArgs];

switch (script) {
	case 'watch-ts-transform':
    case 'build-ts-transform':
	case 'build':
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