import * as webpack from 'webpack';
// import sharedConfig from '../build/shared';
// import * as merge from 'webpack-merge';
import * as ENV from '../env';

const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');
import devConfig from '../../config/build/dev';

// Export a function. Accept the base config as the only param.
module.exports = (storybookBaseConfig, configType) => {
    const config = genDefaultConfig(storybookBaseConfig, configType);

    return {
		...devConfig,
        entry: config.entry,
		output: config.output,
        plugins: [
            ...devConfig.plugins as any[],
            ...config.plugins as any[],
			new webpack.DefinePlugin({
				SRC_PATH: JSON.stringify(ENV.SRC_PATH)
			})
        ]
    }
};