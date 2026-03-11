module.exports = {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	...require('../../jest.config'),
	setupFiles: ['<rootDir>/config/jest-setup.ts'],
	modulePathIgnorePatterns: ['<rootDir>/dist'],
	moduleNameMapper: {
		'^cheerio$': '<rootDir>/__mocks__/cheerio.js',
		'^cheerio/lib/utils$': '<rootDir>/__mocks__/cheerio-utils.js',
	},
};
