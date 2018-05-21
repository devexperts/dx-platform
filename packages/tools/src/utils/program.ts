import { TOOLS_PKG } from '../config/env';

import { Command } from 'commander';
import { Scripts } from '../scripts/constants';

const registeredPrograms = {};

const createProgramAndRegister = (script: Scripts) => {
	const program = new Command();

	registeredPrograms[script] = program;
	program.version(TOOLS_PKG.version);

	return program;
};

export const getProgramForScript = (script: Scripts) => {
	return registeredPrograms[script] ? registeredPrograms[script] : createProgramAndRegister(script);
};
