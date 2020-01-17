import path from 'path';
import { choosePort } from 'react-dev-utils/WebpackDevServerUtils';
import { getProgramForScript } from '../utils/program';
import { Scripts } from './constants';

const program = getProgramForScript(Scripts.STORYBOOK);

console.log('starting...');

const defaultConfigPath = path.resolve(__dirname, '../config/storybook');

program
	.command('storybook')
	.option('-p, --port [portnumber]', 'storybook port', value => parseInt(value, 10), 9001)
	.option('-h, --host [hostname]', 'storybook host', 'localhost')
	.action(function(options) {
		return choosePort(options.host, options.port).then(port => {
			if (!port) {
				throw new Error(`Port ${options.port} already in use`);
			}
			process.argv.push('-c', defaultConfigPath);
			process.argv.push('--port', port.toString());
			process.argv.push('--host', options.host.toString());

			// eslint-disable-next-line @typescript-eslint/no-require-imports
			require('@storybook/react/dist/server'); // tslint:disable-line no-require-imports
		});
	});

program.parse(process.argv);
