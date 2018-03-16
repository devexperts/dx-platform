import {ROOT, SRC_PATH} from '../env';
import { Configuration, DefinePlugin } from 'webpack';
import {
	TS_PATTERN,
	STYLUS_PATTERN,
	CSS_PATTERN,
	FILE_LOADER_EXCLUDES,
	tsLoader,
	babelLoader,
	styleLoader,
	stylusLoader,
	cssLoader,
	postcssLoader,
	urlLoader
} from '../webpack/loaders';

import {
	createForkTSCheckerPlugin,
} from '../webpack/plugins';
import * as ENV from '../env';


const bundleConfig: Configuration = {
	resolve: {
		symlinks: true,
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.styl'],
	},
	resolveLoader: {
		modules: [ENV.TOOLS_NODE_MODULES_PATH]
	},
	entry: [
		require.resolve(`${SRC_PATH}/index.tsx`),
	],
	module: {
		rules: [
			{
				oneOf: [
					{
						test: TS_PATTERN,
						use: [
							babelLoader,
							tsLoader,
						],
					},
					{
						test: STYLUS_PATTERN,
						use: [
							styleLoader,
							cssLoader,
							postcssLoader,
							stylusLoader,
						],
					},
					{
						test: CSS_PATTERN,
						use: [
							styleLoader,
							cssLoader,
							postcssLoader,
						],
					},
					{
						exclude: FILE_LOADER_EXCLUDES,
						use: urlLoader,
					} as any, // typings for webpack doesn't support default case properly
				],
			},
		],
	},
	output: {
		path: `${ROOT}/build`,
		filename: '[name].bundle.js'
	},
	plugins: [
		createForkTSCheckerPlugin(),
		new DefinePlugin({
			ROOT_FOLDER: JSON.stringify(ROOT),
		}),
	],
};

export {bundleConfig as default};

