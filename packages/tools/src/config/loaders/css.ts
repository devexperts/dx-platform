import * as webpack from 'webpack';
import * as ENV from '../env';
import * as autoprefixer from 'autoprefixer';

export const cssLoader: webpack.Configuration = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader?modules&localIdentName=[name]__[local]__[hash:base64:5]',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9', // React doesn't support IE8 anyway
                                    ],
                                    flexbox: 'no-2009',
                                }),
                            ]
                        }
                    }
                ]
            }
        ]
    }
};

