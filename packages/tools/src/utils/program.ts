import {TOOLS_PKG} from '../config/env';

import * as commander from 'commander';
import {Command} from 'commander';

export const program: Command = commander.version(TOOLS_PKG.version);