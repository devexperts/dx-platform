module.exports = {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	...require('../../jest.config'),
	setupFiles: ['<rootDir>/config/jest-setup.ts'],
	modulePathIgnorePatterns: ['<rootDir>/dist'],
};
