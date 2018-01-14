import * as webpack from 'webpack';
import * as ENV from '../env';
const TS_PATTERN = /\.tsx?$/;

import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export const tsLoaderConfig: webpack.Configuration = {
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
                ],
                include: [
                    ENV.SRC_PATH,
                    ENV.TOOLS_ROOT,
                ],
                exclude: [
                    ENV.TOOLS_NODE_MODULES_PATH
                ]
            },
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin()
    ]
};