import { Loader } from 'webpack';
import autoprefixer from 'autoprefixer';

// JavaScript and Typescript compilation

export const TS_PATTERN = /\.tsx?$/;

export const babelLoader: Loader = {
	loader: require.resolve('babel-loader'),
};

export const tsLoader: Loader = {
	loader: require.resolve('ts-loader'),
	options: {
		transpileOnly: true, // don't forget to enable ForkTsCheckerWebpackPlugin
	},
};

// Styles processing

export const STYLUS_PATTERN = /\.styl$/;
export const CSS_PATTERN = /\.css$/;

export const cssLoader: Loader = {
	loader: require.resolve('css-loader'),
	options: {
		importLoaders: 1,
		modules: true,
		localIdentName: '[name]__[local]__[hash:base64:5]',
	},
};

export const styleLoader: Loader = {
	loader: require.resolve('style-loader'),
};

export const postcssLoader: Loader = {
	loader: require.resolve('postcss-loader'),
	options: {
		plugins: () => [
			autoprefixer({
				flexbox: 'no-2009',
			}),
		],
	},
};

export const stylusLoader: Loader = {
	loader: require.resolve('stylus-loader'),
	options: {
		nocheck: true,
		'include css': true,
		'resolve url': true,
	},
};

// file-loaders

export const FILE_LOADER_EXCLUDES = [/\.(ts|tsx)$/, /\.(js|jsx|mjs)$/, /\.html$/, /\.json$/, /\.ejs/];

export const fileLoader: Loader = {
	loader: require.resolve('file-loader'),
	options: {
		name: '[path][name].[ext]?[hash]',
		context: 'src',
	},
};

export const urlLoader: Loader = {
	loader: require.resolve('url-loader'),
};
