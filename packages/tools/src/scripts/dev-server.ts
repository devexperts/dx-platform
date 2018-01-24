import * as path from 'path';
import { program } from '../utils/program';
import * as WebpackDevServer from 'webpack-dev-server';
import { PKG, ROOT } from '../config/env';
import * as webpack from 'webpack';
import devConfig from '../config/build/dev';

process.env.PUBLIC_URL = path.join(ROOT, 'public');

import {
    choosePort,
    createCompiler,
    prepareUrls,
} from 'react-dev-utils/WebpackDevServerUtils';
import Signals = NodeJS.Signals;

const isInteractive = process.stdout.isTTY;
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
	}
};

async function prepare() {
    program
        .option('-p --port [portnumber]', 'storybook port', (value) => parseInt(value, 10),8080)
        .option('-h --host [hostname]', 'storybook host', 'localhost')
        .parse(process.argv);


    const port = await choosePort(program.host, program.port);

    if (!port) {
        throw new Error(`Port ${program.port} already in use`);
    }
    process.argv.push('--port', port.toString());
}

prepare().then(() => {
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const appName = PKG.name;
    const urls = prepareUrls(protocol, program.host, program.port);
    // Create a webpack compiler that is configured with custom messages.
    const compiler = createCompiler(webpack, devConfig, appName, urls, false);

	const devServer = new WebpackDevServer(compiler, serverConfig);

	devServer.listen(program.port, program.host, err => {
		if (err) {
			return console.log(err);
		}
		console.log('Starting the devlopment server...\n');
		// if (isInteractive) {
		// 	clearConsole();
		// }
		// console.log(chalk.cyan('Starting the development server...\n'));
		// openBrowser(urls.localUrlForBrowser);
	});

	['SIGINT', 'SIGTERM'].forEach(function(sig) {
		process.on(sig as Signals, function() {
			devServer.close();
			process.exit();
		});
	});


}).catch(err => console.log('errr', err));