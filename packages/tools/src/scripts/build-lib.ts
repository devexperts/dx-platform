import * as gulp from 'gulp';
import '../tasks/ts-babel';
import '../tasks/copy-stylus';
import { PKG } from '../config/env';

import { Command } from 'commander';

const program = new Command();

program
	.version(PKG.version)
	.command('build-lib')
	.action(function() {
		console.log(`Building library "${PKG.name}"`);
		return gulp.start(['ts-babel', 'copy-stylus']);
	});


program.parse(process.argv);
