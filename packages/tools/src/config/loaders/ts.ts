import { Configuration } from 'webpack';
const TS_PATTERN = /\.tsx?$/;

import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export const tsLoaderConfig: Configuration = {
    module: {
        rules: [
            {
                test: TS_PATTERN,
                use: [
                    require.resolve('babel-loader'),
                    {
                        loader: require.resolve('ts-loader'),
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin()
    ]
};