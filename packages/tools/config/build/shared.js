import path from 'path';
import * as ENV from './../env';
import autoprefixer from 'autoprefixer';

const JS_PATTERN = /\.jsx?$/;
const TS_PATTERN = /\.tsx?$/;
const FILE_PATTERN = /\.png$|\.jpg$|\.gif$|\.svg$|\.swf$|\.ico$|\.(ttf|eot|woff(2)?)(\?[a-z0-9]+)?$/;
const STYLUS_OPTIONS = {
	nocheck: true,
	'include css': true,
	'resolve url': true
};

const plugins = [

];

const loaders = [
	// //es6 libs
	// {
	// 	test: JS_PATTERN,
	// 	loader: 'babel-loader',
	// 	// include: ENV.ES6
	// },
	//js
	{
		test: JS_PATTERN,
		loader: 'babel-loader',
		include: [
			ENV.SRC_PATH,
			ENV.TOOLS_UTILS_PATH,
			ENV.TOOLS_CONFIG_PATH
		]
	},
	//files
	{
		test: FILE_PATTERN,
		// exclude: ENV.SVG_ICONS_PATH,
		loader: 'file-loader?name=[path][name].[ext]?[hash]&context=src'
	},
	//json
	{
		test: /\.json$/,
		include: [
			path.resolve(ENV.SRC_PATH, 'data')
		],
		loader: 'file-loader?name=[path][name].[ext]?[hash]&context=src'
	},
	//svg
	// {
	// 	test: /\.svg$/,
	// 	include: ENV.SVG_ICONS_PATH,
	// 	loader: svgExtractor.extract('svgo')
	// },
	//typescript
	{
		test: TS_PATTERN,
		loader: 'babel-loader!ts-loader',
		include: [
			ENV.SRC_PATH,
			ENV.TOOLS_UTILS_PATH,
			ENV.TOOLS_CONFIG_PATH
		]
	},
	//css
	// {
	// 	test: /\.css$/,
	// 	name: 'css',
	// 	loader: [
	// 		'style',
	// 		'css-loader?localIdentName=[name]__[local]__[hash:base64:5]',
	// 		'postcss-loader'
	// 	].join('!'),
	// 	exclude: [
	// 		ENV.SRC_PATH
	// 	]
	// },
	//css-modules
	{
		test: /\.css$/,
		name: 'css-modules',
		loader: [
			'style',
			'css-loader?modules&localIdentName=[name]__[local]__[hash:base64:5]',
			'postcss-loader'
		].join('!'),
		include: [
			ENV.SRC_PATH
		]
	},
	//stylus
	// {
	// 	test: /\.styl$/,
	// 	name: 'stylus',
	// 	loader: [
	// 		'style',
	// 		'css-loader?localIdentName=[name]__[local]__[hash:base64:5]',
	// 		'postcss-loader',
	// 		`stylus-loader?${JSON.stringify(STYLUS_OPTIONS)}`
	// 	].join('!'),
	// 	exclude: [
	// 		ENV.SRC_PATH
	// 	]
	// },
	//stylus-modules
	{
		test: /\.styl$/,
		name: 'stylus-modules',
		loader: [
			'style',
			'css-loader?modules&localIdentName=[name]__[local]__[hash:base64:5]',
			'postcss-loader',
			`stylus-loader?${JSON.stringify(STYLUS_OPTIONS)}`
		].join('!'),
		include: [
			ENV.SRC_PATH,
			...ENV.STYLUS_PROCESSABLES
		]
	}
];

export default () => ({
	output: {
		path: `${ENV.DIST_PATH}/`,
		publicPath: '/',
		filename: '[name].js'
	},
	module: {
		loaders
	},
    resolveLoader: {
        root: ENV.TOOLS_NODE_MODULES_PATH
    },
	resolve: {
		extensions: [
			'',
			'.ts',
			'.tsx',
			'.js',
			'.jsx'
		]
	},
	plugins,
	postcss() {
		return [
			autoprefixer
		];
	}
});
