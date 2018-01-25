import { SRC_PATH } from '../env';
import { Configuration } from 'webpack';
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
	fileLoader
} from '../webpack/loaders';

import {
	forkTSCheckerPlugin,
	htmlPlugin
} from '../webpack/plugins';
import * as ENV from '../env';

const devConfig: Configuration = {
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
						use: [
							fileLoader,
						],
					} as any, // typings for webpack doesn't support default case properly
				],
			},
		],
	},
	plugins: [
		htmlPlugin,
		forkTSCheckerPlugin,
	],
};

export {devConfig as default};

