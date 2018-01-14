import * as webpack from 'webpack';
import * as autoprefixer from 'autoprefixer';
import * as ENV from '../env'

const STYLUS_OPTIONS = {
	nocheck: true,
	'include css': true,
	'resolve url': true
};

export const stylusLoader: webpack.Configuration = {
    module: {
        rules: [
            {
                test: /\.styl/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                            modules: true,
                            localIdentName: '[name]__[local]__[hash:base64:5]'
                        },
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            sourceMap: true,
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
                    },
                    {
                        loader: require.resolve('stylus-loader'),
                        options: STYLUS_OPTIONS
                    }
                ]
            }
        ]
    }
};

