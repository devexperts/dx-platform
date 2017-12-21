#!/usr/bin/env node
'use strict';

const spawn = require('cross-spawn');
const path = require('path');

const args = process.argv.slice(2);
const TOOLS_ROOT = path.resolve(__dirname, '../');

const script = args[0];

switch (script) {
	case 'watch-ts-transform':
    case 'build-ts-transform':
    case 'build-lib':
	case 'watch-build-lib':
    case 'storybook':
    case 'clean': {
	    require('babel-register')(
		    {
			    ignore: function(filename) {
			    	if ((new RegExp(TOOLS_ROOT)).test(filename)
					    && !(new RegExp(path.resolve(TOOLS_ROOT, 'node_modules'))).test(filename)) {
						    return false;
				    }
			    	return true;
			    },
			    presets: [
				    "env"
			    ],
			    plugins: [
				    "transform-decorators-legacy",
				    "transform-class-properties",
				    "transform-object-rest-spread",
				    "transform-function-bind"
			    ]
		    }
	    );
	    require(require.resolve('../scripts/' + script));
        break;
    }
    default:
        console.log('Unknown script "' + script + '".');
        console.log('Perhaps you need to update @devexperts/tools?');
        break;
}