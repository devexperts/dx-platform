module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	globals: {
		'ts-jest': {
			isolatedModules: true,
			diagnostics: false,
			tsconfig: {
				jsx: 'react-jsx',
			},
		},
	},
};
