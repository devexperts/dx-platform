import * as path from 'path';
import { ROOT } from '../config/env';
import * as rimraf from 'rimraf';

import { Command } from 'commander';

const program = new Command();

program
	.command('clean <folder>')
	.action(function(folder) {
		const pathToRemove = path.join(ROOT, folder);

		rimraf(pathToRemove, () => {
			console.log(`removed: ${pathToRemove}`)
		});
	});


program.parse(process.argv);

