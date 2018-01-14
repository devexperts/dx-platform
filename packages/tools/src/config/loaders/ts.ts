import * as webpack from 'webpack';
import * as ENV from '../env';
const TS_PATTERN = /\.tsx?$/;

export const tsLoaderConfig: webpack.Configuration = {
    module: {
        rules: [
            {
                test: TS_PATTERN,
                use: [
                    require.resolve('babel-loader'),
                    require.resolve('ts-loader')
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
    }
};