import * as webpack from 'webpack';
import * as ENV from '../env';

const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');
import {
	babelLoader,
	tsLoader,
	cssLoader,
	fileLoader,
	postcssLoader,
	styleLoader,
	stylusLoader,
	CSS_PATTERN,
	STYLUS_PATTERN,
	TS_PATTERN,
	FILE_LOADER_EXCLUDES,
} from '../webpack/loaders';

import {
	createForkTSCheckerPlugin
} from '../webpack/plugins';
import { Configuration } from 'webpack';

// Export a function. Accept the base config as the only param.
module.exports = (storybookBaseConfig, configType): Configuration => {
    const config = genDefaultConfig(storybookBaseConfig, configType);

    return {
        entry: config.entry,
		output: config.output,
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
            ...config.plugins as any[],
			createForkTSCheckerPlugin(),
			new webpack.DefinePlugin({
				SRC_PATH: JSON.stringify(ENV.SRC_PATH)
			})
        ],
		resolve: {
			symlinks: true,
			extensions: ['.ts', '.tsx', '.js', '.jsx', '.styl'],
		},
		resolveLoader: {
			modules: [ENV.TOOLS_NODE_MODULES_PATH]
		},
    }
};