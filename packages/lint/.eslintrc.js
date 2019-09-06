module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	env: {
		browser: true,
		es6: true,
		jest: true,
		node: true,
	},
	// extends: ['prettier', 'prettier/@typescript-eslint'],
	plugins: [/*'prettier',*/ '@typescript-eslint', 'jsdoc'],
	rules: {
		// 'prettier/prettier': 'error',
		'@typescript-eslint/adjacent-overload-signatures': 'off',
		'@typescript-eslint/array-type': 'off',
		'@typescript-eslint/class-name-casing': 'error',
		'@typescript-eslint/consistent-type-definitions': 'off',
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/indent': 'off',
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/member-delimiter-style': [
			'error',
			{
				multiline: { delimiter: 'semi', requireLast: true },
				singleline: { delimiter: 'semi', requireLast: false },
			},
		],
		'@typescript-eslint/member-ordering': 'off',
		'@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-for-in-array': 'off',
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/no-magic-numbers': 'off',
		'@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
		'@typescript-eslint/no-parameter-properties': 'off',
		'@typescript-eslint/no-require-imports': 'error',
		'@typescript-eslint/no-var-requires': 'error',
		'@typescript-eslint/triple-slash-reference': ['error', { path: 'never' }],
		'@typescript-eslint/prefer-for-of': 'error',
		'@typescript-eslint/prefer-function-type': 'off',
		'@typescript-eslint/prefer-interface': 'off',
		'@typescript-eslint/prefer-namespace-keyword': 'error',
		'@typescript-eslint/promise-function-async': 'off',
		'@typescript-eslint/restrict-plus-operands': 'off',
		'@typescript-eslint/semi': 'error',
		'@typescript-eslint/strict-boolean-expressions': 'off',
		'@typescript-eslint/typedef': [
			'error',
			{ propertyDeclaration: true, arrowParameter: false, memberVariableDeclaration: false, parameter: false },
		],
		'@typescript-eslint/type-annotation-spacing': 'error',
		'@typescript-eslint/unified-signatures': 'error',
		'jsdoc/check-alignment': 'error',
		'arrow-parens': ['error', 'as-needed'],
		'spaced-comment': 'off',
		'capitalized-comments': 'off',
		'comma-dangle': 'off',
		complexity: 'off',
		curly: 'error',
		'default-case': 'off',
		'dot-notation': 'off',
		'eol-last': 'off',
		eqeqeq: 'error',
		'guard-for-in': 'error',
		indent: 'off',
		'linebreak-style': 'off',
		'max-classes-per-file': 'off',
		'max-lines': 'off',
		'new-parens': 'error',
		'newline-per-chained-call': 'off',
		'no-bitwise': 'error',
		'no-caller': 'error',
		'no-cond-assign': 'error',
		'no-debugger': 'error',
		'no-duplicate-case': 'error',
		'no-empty': 'off',
		'no-empty-functions': 'off',
		'no-eval': 'error',
		'no-extra-semi': 'off',
		'no-fallthrough': 'off',
		'no-invalid-this': 'off',
		'no-irregular-whitespace': 'off',
		'no-magic-numbers': 'off',
		'no-multiple-empty-lines': 'error',
		'no-new-wrappers': 'error',
		'no-redeclare': 'error',
		'no-shadow': 'off',
		'no-throw-literal': 'error',
		'no-trailing-spaces': 'error',
		'no-unsafe-finally': 'error',
		'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
		'no-unused-labels': 'off',
		'no-var': 'error',
		'no-void': 'off',
		'object-shorthand': 'error',
		'one-var': ['error', 'never'],
		'prefer-const': 'error',
		'quote-props': ['error', 'as-needed'],
		quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
		radix: 'error',
		semi: ['error', 'always'],
		'space-before-function-paren': 'off',
		'sort-keys': 'off',
		'use-isnan': 'error',
	},
};
