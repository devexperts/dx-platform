import * as path from 'path';
import * as WebpackDevServer from 'webpack-dev-server';
import { PKG, ROOT } from '../config/env';
import * as webpack from 'webpack';
import devConfig from '../config/build/dev';

import { getProgramForScript } from '../utils/program';
import { Scripts } from './constants';

const program = getProgramForScript(Scripts.DEV_SERVER);

import {
    choosePort,
    createCompiler,
    prepareUrls,
} from 'react-dev-utils/WebpackDevServerUtils';
import Signals = NodeJS.Signals;

// const isInteractive = process.stdout.isTTY;
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
    return port;
}

prepare().then((port) => {
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const appName = PKG.name;
    const urls = prepareUrls(protocol, program.host, port);
    // Create a webpack compiler that is configured with custom messages.
    const compiler = createCompiler(webpack, devConfig, appName, urls, false);

	const devServer = new WebpackDevServer(compiler, serverConfig);

	devServer.listen(port, program.host, err => {
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


}).catch(err => console.log('errr', err));