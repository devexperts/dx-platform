import path from 'path';
import WebpackDevServer from 'webpack-dev-server';
import { PKG, ROOT } from '../config/env';
import webpack from 'webpack';
import devConfig from '../config/build/dev';

import { getProgramForScript } from '../utils/program';
import { Scripts } from './constants';

import { choosePort, createCompiler, prepareUrls } from 'react-dev-utils/WebpackDevServerUtils';
import Signals = NodeJS.Signals;

const program = getProgramForScript(Scripts.DEV_SERVER);

process.env.PUBLIC_URL = path.join(ROOT, 'public');
console.log('starting...');

const serverConfig = {
	compress: true,
	clientLogLevel: 'none',
	hot: true,
	quiet: true,
	overlay: false,
	historyApiFallback: {
		// Paths with dots should still use the history fallback.
		// See https://github.com/facebookincubator/create-react-app/issues/387.
		disableDotRule: true,
	},
};

program
	.command('dev-server')
	.option('-p --port [portnumber]', 'dev-server port', value => parseInt(value, 10), 8080)
	.option('-h --host [hostname]', 'dev-server host', 'localhost')
	.action(function(options) {
		return choosePort(options.host, options.port).then(port => {
			if (!port) {
				throw new Error(`Port ${options.port} already in use`);
			}

			const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
			const appName = PKG.name;
			const urls = prepareUrls(protocol, options.host, port);
			// Create a webpack compiler that is configured with custom messages.
			const compiler = createCompiler(webpack, devConfig, appName, urls, false);

			const devServer = new WebpackDevServer(compiler, serverConfig);

			devServer.listen(port, options.host, err => {
				if (err) {
					return console.log(err);
				}
				console.log('Starting the devlopment server...\n');
			});

			['SIGINT', 'SIGTERM'].forEach(function(sig) {
				process.on(sig as Signals, function() {
					devServer.close();
					process.exit();
				});
			});
		});
	});

program.parse(process.argv);
