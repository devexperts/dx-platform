import * as ENV from '../env';
import shared from './shared';
// import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
// import webpack from 'webpack';
// import ExtractTextPlugin from 'extract-text-webpack-plugin';

// const css = new ExtractTextPlugin('css', '[name].css');
// import DeclarationBundlerPlugin from 'declaration-bundler-webpack-plugin' ;

const plugins = [
	// new HtmlWebpackPlugin({
	// 	filename: 'index.html',
	// 	template: path.resolve(ENV.SRC_PATH, 'index.html'),
	// 	inject: 'body'
	// }),
	// new webpack.DefinePlugin({
	// 	'process.env': {
	// 		NODE_ENV: '"production"'
	// 	}
	// }),
	// new webpack.optimize.UglifyJsPlugin({
	// 	mangle: false
	// }),
    // new DeclarationBundlerPlugin({
    //     moduleName: pkg.name,
    //     out: path.join('index.d.ts'),
    // }),
	// new SplitByPathPlugin([
	// 	{
	// 		name: 'vendor',
	// 		path: [
	// 			ENV.NODE_MODULES_PATH
	// 		]
	// 	}
	// ], {
	// 	manifest: 'manifest'
	// })
];

// const patchCSSLoader = loaderOptions => {
// 	return {
// 		...loaderOptions,
// 		loader: css.extract(
// 			'style',
// 			loaderOptions.loader.replace(/^style!/, '')
// 		)
// 	};
// };

export default () => {
	const config = shared();

	const index = [
		path.resolve(ENV.SRC_PATH, 'index.tsx')
	];

	// const loaders = config.module.loaders.map(loader => {
	// 	if (['css', 'css-modules', 'stylus', 'stylus-modules'].includes(loader.name)) {
	// 		return patchCSSLoader(loader);
	// 	}
	// 	return loader;
	// });

	return {
		...config,
        externals: {
            react: {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react',
            },
            'react-dom': {
                root: 'ReactDOM',
                commonjs2: 'react-dom',
                commonjs: 'react-dom',
                amd: 'react-dom',
            },
        },
		entry: {
			...config.entry,
			index
		},
		output: {
			...config.output,
			library: ENV.PKG.name,
			libraryTarget: 'umd'
		},
		module: {
			...config.module,
		},
		plugins: [
			...config.plugins,
			...plugins
		]
	};
};