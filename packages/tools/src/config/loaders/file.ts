import { Configuration } from 'webpack';

const FILE_PATTERN = /\.png$|\.jpg$|\.gif$|\.svg$|\.swf$|\.ico$|\.(ttf|eot|woff(2)?)(\?[a-z0-9]+)?$/;

export const fileLoaderConfig: Configuration = {
	module: {
		rules: [
			{
				test: FILE_PATTERN,
				use: {
					loader: require.resolve('file-loader'),
					options: {
						name: '[path][name].[ext]?[hash]',
						context: 'src'
					}
				}
			}
		]
	}
};