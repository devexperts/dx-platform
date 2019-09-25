import * as path from 'path';
import { ROOT } from '../config/env';
import { getProgramForScript } from '../utils/program';
import { Scripts } from './constants';
import rimraf from 'rimraf';

const program = getProgramForScript(Scripts.CLEAN);

program.command('clean <folder>').action(function(folder) {
	const pathToRemove = path.join(ROOT, folder);

	rimraf(pathToRemove, () => {
		console.log(`removed: ${pathToRemove}`);
	});
});

program.parse(process.argv);
