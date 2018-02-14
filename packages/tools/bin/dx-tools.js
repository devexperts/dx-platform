#!/usr/bin/env node
'use strict';

const { Command } = require('commander');
const pkg = require('../package.json');
const { Scripts } = require('../lib/scripts/constants');

const AVAILABLE_SCRIPTS = Object.values(Scripts);
const program = new Command();

program
	.version(pkg.version);

program
	.command('* <script>')
	.action(function(script) {
		if (AVAILABLE_SCRIPTS.indexOf(script) > -1) {
			require(`../lib/scripts/${script}.js`);
		} else {
			console.log(`Unknown script "${script}".`);
			console.log('Perhaps you need to update @devexperts/tools?');
		}

	});

program.parse(process.argv);