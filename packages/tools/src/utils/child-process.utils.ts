// copy-paste from "lerna"

import chalk from 'chalk';
import execa from 'execa';
import logTransformer from 'strong-log-transformer';
import { ExecaChildProcess } from 'execa';

// bookkeeping for spawned processes
let children = 0;

// when streaming children are spawned, use this color for prefix
const colorWheel = ['cyan', 'magenta', 'blue', 'yellow', 'green', 'red'];
const NUM_COLORS = colorWheel.length;

function exec(command, args, opts) {
	const options = Object.assign({}, opts);
	options.stdio = 'pipe'; // node default

	return _spawn(command, args, options);
}

function execSync(command, args, opts) {
	return execa.sync(command, args, opts).stdout;
}

function spawn(command, args, opts) {
	const options = Object.assign({}, opts);
	options.stdio = 'inherit';

	return _spawn(command, args, options);
}

// istanbul ignore next
function spawnStreaming(command: string, prefix: string, args?: any, opts?: any) {
	const options = Object.assign({}, opts);
	options.stdio = ['ignore', 'pipe', 'pipe'];

	const colorName = colorWheel[children % NUM_COLORS];
	const color = chalk[colorName];
	const spawned = _spawn(command, args, options);

	const prefixedStdout = logTransformer({ tag: `${color.bold(prefix)}:` });
	const prefixedStderr = logTransformer({ tag: `${color(prefix)}:`, mergeMultiline: true });

	// Avoid "Possible EventEmitter memory leak detected" warning due to piped stdio
	if (children > process.stdout.listenerCount('close')) {
		process.stdout.setMaxListeners(children);
		process.stderr.setMaxListeners(children);
	}

	spawned.stdout && spawned.stdout.pipe(prefixedStdout).pipe(process.stdout);
	spawned.stderr && spawned.stderr.pipe(prefixedStderr).pipe(process.stderr);

	return spawned;
}

function getChildProcessCount() {
	return children;
}

// eslint-disable-next-line no-underscore-dangle
function _spawn(command, args, opts): ExecaChildProcess {
	children += 1;

	const child = execa(command, args, opts);
	const drain = (code, signal) => {
		children -= 1;

		// don't run repeatedly if this is the error event
		if (signal === undefined) {
			child.removeListener('exit', drain);
		}
	};

	child.once('exit', drain);
	child.once('error', drain);

	return child;
}

export { exec, execSync, spawn, spawnStreaming, getChildProcessCount };
