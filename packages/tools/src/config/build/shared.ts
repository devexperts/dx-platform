import * as webpack from 'webpack';
import * as ENV from '../env';
import * as merge from 'webpack-merge';
import { tsLoaderConfig } from '../loaders/ts';
import { cssLoader } from '../loaders/css';
import { stylusLoader } from '../loaders/stylus';

const sharedConfig: webpack.Configuration = {
	devtool: false,
	output: {
		pathinfo: true
	},
	resolveLoader: {
		modules: [ENV.TOOLS_NODE_MODULES_PATH]
	},
    resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.styl']
	}
};

export default  merge([
    tsLoaderConfig,
    sharedConfig,
    cssLoader,
    stylusLoader
]);
