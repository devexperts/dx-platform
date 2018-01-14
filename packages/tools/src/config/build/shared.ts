import * as webpack from 'webpack';
import * as ENV from '../env';
import * as merge from 'webpack-merge';
import { tsLoaderConfig } from '../loaders/ts';
import { cssLoader } from '../loaders/css';
import { stylusLoader } from '../loaders/stylus';

// import * as path from 'path';
// import * as autoprefixer from 'autoprefixer';
//
// const JS_PATTERN = /\.jsx?$/;
// const TS_PATTERN = /\.tsx?$/;
// const FILE_PATTERN = /\.png$|\.jpg$|\.gif$|\.svg$|\.swf$|\.ico$|\.(ttf|eot|woff(2)?)(\?[a-z0-9]+)?$/;
// const STYLUS_OPTIONS = {
// 	nocheck: true,
// 	'include css': true,
// 	'resolve url': true
// };
//
// const plugins = [
//
// ];
//
// const loaders = [
// 	{
// 		test: JS_PATTERN,
// 		loader: 'babel-loader',
// 		include: [
// 			ENV.SRC_PATH,
// 			ENV.TOOLS_ROOT,
// 		],
// 		exclude: [
//             ENV.TOOLS_NODE_MODULES_PATH
// 		]
// 	},
// 	//files
// 	{
// 		test: FILE_PATTERN,
// 		// exclude: ENV.SVG_ICONS_PATH,
// 		loader: 'file-loader?name=[path][name].[ext]?[hash]&context=src'
// 	},
// 	//json
// 	{
// 		test: /\.json$/,
// 		include: [
// 			path.resolve(ENV.SRC_PATH, 'data')
// 		],
// 		loader: 'file-loader?name=[path][name].[ext]?[hash]&context=src'
// 	},
// 	{
// 		test: TS_PATTERN,
// 		loader: 'babel-loader!ts-loader',
//         include: [
//             ENV.SRC_PATH,
//             ENV.TOOLS_ROOT,
//         ],
//         exclude: [
//             ENV.TOOLS_NODE_MODULES_PATH
//         ]
// 	},
// 	{
// 		test: /\.css$/,
// 		name: 'css-modules',
// 		loader: [
// 			'style',
// 			'css-loader?modules&localIdentName=[name]__[local]__[hash:base64:5]',
// 			'postcss-loader'
// 		].join('!'),
// 		include: [
// 			ENV.SRC_PATH
// 		]
// 	},
// 	{
// 		test: /\.styl$/,
// 		name: 'stylus-modules',
// 		loader: [
// 			'style',
// 			'css-loader?modules&localIdentName=[name]__[local]__[hash:base64:5]',
// 			'postcss-loader',
// 			`stylus-loader?${JSON.stringify(STYLUS_OPTIONS)}`
// 		].join('!'),
// 	}
// ];
//
// export default () => ({
// 	output: {
// 		path: `${ENV.DIST_PATH}/`,
// 		publicPath: '/',
// 		filename: '[name].js'
// 	},
// 	module: {
// 		rules: [
// 			...loaders
// 		]
// 	},
//     resolveLoader: {
//         modules: [ENV.TOOLS_NODE_MODULES_PATH]
//     },
// 	resolve: {
// 		extensions: [
// 			'',
// 			'.ts',
// 			'.tsx',
// 			'.js',
// 			'.jsx'
// 		]
// 	},
// 	plugins,
// 	postcss() {
// 		return [
// 			autoprefixer
// 		];
// 	}
// });

const sharedConfig: webpack.Configuration = {
	devtool: false,
	output: {
		pathinfo: true
	},
	resolveLoader: {
		modules: [ENV.TOOLS_NODE_MODULES_PATH]
	},
    resolve: {
		modules: [ENV.TOOLS_NODE_MODULES_PATH, ENV.NODE_MODULES_PATH],
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.styl']
	}
};

export default  merge([
    tsLoaderConfig,
    sharedConfig,
    cssLoader,
    stylusLoader
]);
