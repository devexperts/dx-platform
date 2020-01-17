import { getProgramForScript } from '../utils/program';
import { Scripts } from './constants';
import { ROOT } from '../config/env';
import path from 'path';

import { startTransform } from '../tasks/ts-transform';
import { startSync } from '../tasks/sync';

const program = getProgramForScript(Scripts.BUILD_LIB);

program
	.command('build-lib <src> <dist>')
	.option('-w, --watch', 'start in watch mode')
	.option('-f, --failOnError', 'start in watch mode')
	.option('-p, --project <project>', 'relative path to tsconfig.json')
	.action(function(src, dist, options) {
		const SRC_PATH = path.join(ROOT, src);
		const DIST_PATH = path.join(ROOT, dist);
		const TSCONFIG_PATH = path.join(ROOT, options.project);

		startSync(SRC_PATH, DIST_PATH, options.watch);
		startTransform(SRC_PATH, DIST_PATH, TSCONFIG_PATH, options.watch, options.failOnError);
	});

program.parse(process.argv);
