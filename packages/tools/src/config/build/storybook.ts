import * as ENV from '../env';
import shared from './shared';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

const plugins = [
	new webpack.DefinePlugin({
		SRC_PATH: JSON.stringify(ENV.SRC_PATH)
	}),
	new webpack.HotModuleReplacementPlugin(),
	new HtmlWebpackPlugin({
		filename: 'index.html',
		template: path.resolve(ENV.TOOLS_ROOT, 'resources/storybook/index.html'),
		chunks: [
			'manager'
		],
		inject: 'body'
	}),
	new HtmlWebpackPlugin({
		filename: 'iframe.html',
		template: path.resolve(ENV.TOOLS_ROOT, 'resources/storybook/iframe.html'),
		chunks: [
			'preview'
		],
		inject: 'body'
	})
];

export default (host, port, standalone) => {
	const config = shared();
	const devChunks = [
		require.resolve('react-hot-loader/patch'),
		`${require.resolve('webpack-dev-server/client')}?http://${host}:${port}`,
		require.resolve('webpack/hot/only-dev-server')
	];
	const output = standalone ? {
		...config.output,
		publicPath: '',
		path: path.resolve(ENV.DIST_PATH, 'storybook'),
	} : config.output;
	return {
		...config,
		devtool: "source-map",
		output,
		entry: {
			manager: [
				// ENV.POLYFILLS,
				require.resolve('@kadira/storybook/dist/server/addons.js'),
				require.resolve('@kadira/storybook/dist/client/manager/index.js')
			],
			preview: [
				// ENV.POLYFILLS,
				...(standalone ? [] : devChunks),
				require.resolve('@kadira/storybook/dist/server/addons.js'),
                path.resolve(ENV.TOOLS_ROOT, 'resources/storybook/client.js')
			]
		},
		resolve: {
			...config.resolve,
			alias: {
				// ...config.resolve.alias,
				// '~DemoComponent': path.resolve(ENV.SRC_PATH, 'dev/demo.tsx')
			}
		},
		plugins: [
			...config.plugins,
			...plugins
		]
	};
};