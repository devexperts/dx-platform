import { ROOT } from '../env';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';

export const htmlPlugin = new HtmlWebpackPlugin({
	inject: true,
	template: require.resolve(`${ROOT}/public/index.html`),
});

export const forkTSCheckerPlugin = new ForkTsCheckerWebpackPlugin();

export const cssExtractTextPlugin = new ExtractTextPlugin({
	filename: '[name].css',
});