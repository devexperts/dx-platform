import * as path from 'path';
import * as fs from 'fs';
let OVERRIDES: any = {};

export const TOOLS_ROOT = path.join(__dirname, '../../');

export const ROOT = process.cwd();

if (fs.existsSync(path.resolve(ROOT, '.dx-tools'))) {
	OVERRIDES = require(path.resolve(ROOT, '.dx-tools'));
}

export const NODE_MODULES_PATH = path.resolve(ROOT, 'node_modules');
export const TOOLS_NODE_MODULES_PATH = path.resolve(TOOLS_ROOT, 'node_modules');

export const PKG = require(path.join(ROOT, 'package.json'));
export const TOOLS_PKG = require(path.join(TOOLS_ROOT, 'package.json'));

export const SRC_PATH = OVERRIDES.SRC_PATH || path.resolve(ROOT, 'src');
export const DIST_PATH = OVERRIDES.DIST_PATH || path.resolve(ROOT, 'lib');
export const STYLUS_PROCESSABLES = OVERRIDES.STYLUS_PROCESSABLES || [];

export const STATS = OVERRIDES.STATS || {
	assets: true,
	colors: true,
	version: false,
	hash: false,
	timings: false,
	chunks: false,
	chunkModules: false,
	children: false,
};
