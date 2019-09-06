import { getProgramForScript } from '../utils/program';
import { Scripts } from './constants';

const defaultConfig = require.resolve('../config/build/bundle');

const program = getProgramForScript(Scripts.BUILD);

program
	.command('build-bundle')
	.option('-c, --config [config]', 'path to webpack config', defaultConfig)
	.action(function(options) {
		const [node, bin] = program.rawArgs;
		process.argv = [node, bin, '--config', options.config];
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		require('webpack/bin/webpack.js'); // tslint:disable-line no-require-imports
	});

program.parse(process.argv);
