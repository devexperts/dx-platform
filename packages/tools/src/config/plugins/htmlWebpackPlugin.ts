import { ROOT } from '../env';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';

export const htmlWebpackPlugin = {
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: require.resolve(`${ROOT}/public/index.html`),
		})
	]
}