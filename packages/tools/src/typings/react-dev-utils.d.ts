declare module 'react-dev-utils/WebpackDevServerUtils' {
	type Urls = {
		lanUrlForConfig: string;
		lanUrlForTerminal: string;
		localUrlForTerminal: string;
		localUrlForBrowser: string;
	};

	import webpack = require('webpack');

	export function choosePort(host: string, defaultPort: number): Promise<number>;
	export function createCompiler(
		webpack: any,
		config: webpack.Configuration,
		appName: string,
		urls: Urls,
		useYarn: boolean,
	): Promise<webpack.Compiler>;
	export const prepareUrls: (protocol: string, host: string, port: string | number) => Urls;
}
