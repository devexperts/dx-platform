import { getProgramForScript } from '../utils/program';
import { Scripts } from './constants';

const defaultConfig = require.resolve('../config/build/prod');
console.log('sad', defaultConfig);

const program = getProgramForScript(Scripts.BUILD);

program
	.command('build')
	.option('-c, --config [config]', 'path to webpack config', defaultConfig)
	.action(function(options) {
		const [node, bin] = program.rawArgs;
		process.argv = [node, bin, '--config', options.config];
		require('webpack/bin/webpack.js');
	});

program.parse(process.argv);