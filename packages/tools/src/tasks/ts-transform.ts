import { spawnStreaming } from '../utils/child-process.utils';
import { ExecaChildProcess } from 'execa';

export const startTransform: (src: string, dist: string, tsconfig: string, isWatch: boolean) => ExecaChildProcess =
	(src, dist, tsconfig, isWatch) => {

	const args = ['-p', tsconfig, '--outDir', dist];

	if (isWatch) {
		args.push('-w');
	} else {
		args.push('--diagnostics')
	}

	return spawnStreaming(`${require.resolve('typescript/bin/tsc')}`, 'tsc', args);
};