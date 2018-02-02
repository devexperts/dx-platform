import { SRC_PATH, ROOT } from '../env';
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
	createForkTSCheckerPlugin,
	createHtmlPlugin,
	createCssExtractTextPlugin
} from '../webpack/plugins';

const cssExtractor = createCssExtractTextPlugin();
import * as ENV from '../env';

const devConfig: Configuration = {
	resolve: {
		symlinks: true,
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.styl'],
	},
	resolveLoader: {
		modules: [ENV.TOOLS_NODE_MODULES_PATH]
	},
	entry: {
		index: [
			require.resolve(`${SRC_PATH}/index.tsx`),
		]
	},
	output: {
		path: `${ROOT}/build`,
		filename: '[name].[chunkhash:8].js'
	},
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
						use: cssExtractor.extract({
							fallback: styleLoader,
							use: [
								cssLoader,
								postcssLoader,
								stylusLoader,
							]
						})
					},
					{
						test: CSS_PATTERN,
						use: cssExtractor.extract({
							fallback: styleLoader,
							use: [
								cssLoader,
								postcssLoader,
							]
						})
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
		cssExtractor,
		createHtmlPlugin(),
		createForkTSCheckerPlugin(),
	],
};

export {devConfig as default};

