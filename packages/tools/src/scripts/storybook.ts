import {PKG} from '../config/env';
import {createLogger} from '../utils/logger';
import * as path from 'path';

const log = createLogger(PKG.name, 'storybook');

log('starting...');

const defaultConfigPath = path.resolve(__dirname, '../config/storybook');

process.argv.push('-c', defaultConfigPath);
process.argv.push('--port', '9001');

require('@storybook/react/dist/server');
