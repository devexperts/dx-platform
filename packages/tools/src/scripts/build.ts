process.argv.push('--config', require.resolve('../config/build/prod'));

require('webpack/bin/webpack.js');