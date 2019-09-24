const path = require('path');

module.exports = async ({ config }) => {
	// config.module.rules.push({
	// 	test: /\.(stories|story)\.mdx$/,
	// 	use: [
	// 		{
	// 			loader: 'babel-loader',
	// 			// may or may not need this line depending on your app's setup
	// 			plugins: ['@babel/plugin-transform-react-jsx'],
	// 		},
	// 		{
	// 			loader: '@mdx-js/loader',
	// 			options: {
	// 				compilers: [createCompiler({})],
	// 			},
	// 		},
	// 	],
	// });
	// config.module.rules.push({
	// 	test: /\.stories\.tsx?$/,
	// 	loader: require.resolve('@storybook/source-loader'),
	// 	exclude: [/node_modules/],
	// 	enforce: 'pre',
	// });
	config.module.rules.push({
		test: /\.tsx?$/,
		include: path.resolve(__dirname, '../src'),
		use: [require.resolve('ts-loader'), require.resolve('react-docgen-typescript-loader')],
	});
	config.resolve.extensions.push('.ts', '.tsx');
	return config;
};
