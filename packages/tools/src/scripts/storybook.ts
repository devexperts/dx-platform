import * as minimist from 'minimist';
import storybook from '../config/build/storybook';
import * as webpack from 'webpack';
import * as WDS from 'webpack-dev-server';
import * as ENV from '../config/env';

import {createLogger} from '../utils/logger';

const log = createLogger(ENV.PKG.name, 'storybook');

const argv = minimist(process.argv.slice(2));
const port = argv['port'] || 9001;
const host = argv['host'] || 'localhost';

log('Starting...');

const config = storybook(host, port, false);
const compiler = webpack(config);
const server = new WDS(compiler, {
	hot: true,
	historyApiFallback: true,
	stats: ENV.STATS
});

server.listen(port, host, (error, result) => {
	if (error) {
		return console.error(error);
	}

	log(`Listening at http://${host}:${port}/`);
	log('Compiling...');
});