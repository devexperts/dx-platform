import { SRC_PATH } from '../env';
import * as merge from 'webpack-merge';
import sharedConfig from './shared';
import { htmlWebpackPlugin } from '../plugins/htmlWebpackPlugin';

import { Configuration } from 'webpack';

const entryPoints: Configuration = {
	resolve: {
		symlinks: true
	},
	entry: [
		require.resolve(`${SRC_PATH}/index.tsx`)
	]
};

export default merge([
	entryPoints,
	htmlWebpackPlugin,
	sharedConfig
]);

