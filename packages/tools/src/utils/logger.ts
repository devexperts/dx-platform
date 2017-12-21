export const createLogger = (project, script) =>
	(message, level = 'log') => console[level](`[${project}][${script}] ${message}`);