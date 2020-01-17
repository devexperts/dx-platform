import { spawnStreaming } from '../utils/child-process.utils';
import { ExecaChildProcess } from 'execa';
import path from 'path';

export const startSync: (src: string, dist: string, isWatch: boolean) => ExecaChildProcess = (src, dist, isWatch) => {
	const srcFolder = path.relative(process.cwd(), src);
	const distFolder = path.relative(process.cwd(), dist);

	const args = [`-d=false`, `${srcFolder}/**/*`, `!${srcFolder}/**/*.{ts,tsx}`, `${distFolder}`];

	if (isWatch) {
		args.push('-w');
	}

	return spawnStreaming(`${require.resolve('sync-glob/bin/sync-glob')}`, 'sync-glob', args);
};
