import path from 'path';

export const TOOLS_ROOT = path.join(__dirname, '../');

export const ROOT = process.cwd();
export const SRC_PATH = path.resolve(ROOT, 'src');
export const DIST_PATH = path.resolve(ROOT, 'lib');
export const NODE_MODULES_PATH = path.resolve(ROOT, 'node_modules');
export const TOOLS_NODE_MODULES_PATH = path.resolve(TOOLS_ROOT, 'node_modules');
export const POLYFILLS = path.resolve(TOOLS_ROOT, 'polyfills.ts');

export const PKG = require(path.join(ROOT, 'package.json'));