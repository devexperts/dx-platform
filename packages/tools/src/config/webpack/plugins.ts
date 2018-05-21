import { ROOT } from '../env';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';

export const createHtmlPlugin = () =>
	new HtmlWebpackPlugin({
		inject: true,
		template: require.resolve(`${ROOT}/public/index.html`),
	});

export const createForkTSCheckerPlugin = () => new ForkTsCheckerWebpackPlugin();

export const createCssExtractTextPlugin = () =>
	new ExtractTextPlugin({
		filename: '[name].css',
	});
