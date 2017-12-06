import { dasherize, camelize, capitalize, randomId, decapitalize, pluralize3, pluralize2 } from '../string';
import split from '../split';

describe('string', () => {
	describe('dasherize', () => {
		it('should replace camelCase with dashes', () => {
			expect(dasherize('aBcDe')).toBe('a-bc-de');
		});
		it('should replace CamelCase with dashed preserving case', () => {
			expect(dasherize('aBcDe', false)).toBe('a-Bc-De');
		});
	});

	describe('camelize', () => {
		it('should replace _,-,\\s with camelCase', () => {
			expect(camelize('aa_bb-cc dd')).toBe('aaBbCcDd');
		});
		it('should replace _,-,\\s with CamelCase with first letter capitalized', () => {
			expect(camelize('aa_bb-cc dd', false)).toBe('AaBbCcDd');
		});
	});

	describe('randomId', () => {
		it('should generate random id with prefix and postfix', () => {
			expect(randomId()).not.toBe(randomId());
			expect(/^prefix/.test(randomId('prefix'))).toBeTruthy();
			expect(/^prefix.+postfix$/.test(randomId('prefix', 'postfix'))).toBeTruthy();
		});
	});

	describe('capitalize', () => {
		it('should replace first letter with capital', () => {
			expect(capitalize('foo')).toBe('Foo');
		});
	});

	describe('decapitalize', () => {
		it('should replace first letter with noncapital', () => {
			expect(decapitalize('Foo')).toBe('foo');
		});
	});

	describe('pluralize', () => {
		it('should take correct value for 3 base declensions', () => {
			const declensions = [
				'one',
				'two-three-four',
				'zero-many'
			];
			expect(pluralize3(0, declensions)).toBe('zero-many');
			expect(pluralize3(1, declensions)).toBe('one');
			expect(pluralize3(2, declensions)).toBe('two-three-four');
			expect(pluralize3(3, declensions)).toBe('two-three-four');
			expect(pluralize3(4, declensions)).toBe('two-three-four');
			expect(pluralize3(5, declensions)).toBe('zero-many');
			expect(pluralize3(6, declensions)).toBe('zero-many');
			expect(pluralize3(7, declensions)).toBe('zero-many');
			expect(pluralize3(8, declensions)).toBe('zero-many');
			expect(pluralize3(9, declensions)).toBe('zero-many');
			expect(pluralize3(10, declensions)).toBe('zero-many');
			expect(pluralize3(11, declensions)).toBe('zero-many');
			expect(pluralize3(12, declensions)).toBe('zero-many');
			expect(pluralize3(13, declensions)).toBe('zero-many');
			expect(pluralize3(14, declensions)).toBe('zero-many');
			expect(pluralize3(15, declensions)).toBe('zero-many');
			expect(pluralize3(16, declensions)).toBe('zero-many');
			expect(pluralize3(17, declensions)).toBe('zero-many');
			expect(pluralize3(18, declensions)).toBe('zero-many');
			expect(pluralize3(19, declensions)).toBe('zero-many');
			expect(pluralize3(20, declensions)).toBe('zero-many');
			expect(pluralize3(21, declensions)).toBe('one');
		});

		it('should take correct value for 2 base declensions', () => {
			const declensions = [
				'one',
				'zero-many'
			];
			expect(pluralize2(0, declensions)).toBe('zero-many');
			expect(pluralize2(1, declensions)).toBe('one');
			expect(pluralize2(2, declensions)).toBe('zero-many');
			expect(pluralize2(3, declensions)).toBe('zero-many');
			expect(pluralize2(4, declensions)).toBe('zero-many');
			expect(pluralize2(5, declensions)).toBe('zero-many');
			expect(pluralize2(6, declensions)).toBe('zero-many');
			expect(pluralize2(7, declensions)).toBe('zero-many');
			expect(pluralize2(8, declensions)).toBe('zero-many');
			expect(pluralize2(9, declensions)).toBe('zero-many');
			expect(pluralize2(10, declensions)).toBe('zero-many');
			expect(pluralize2(11, declensions)).toBe('zero-many');
			expect(pluralize2(12, declensions)).toBe('zero-many');
			expect(pluralize2(13, declensions)).toBe('zero-many');
			expect(pluralize2(14, declensions)).toBe('zero-many');
			expect(pluralize2(15, declensions)).toBe('zero-many');
			expect(pluralize2(16, declensions)).toBe('zero-many');
			expect(pluralize2(17, declensions)).toBe('zero-many');
			expect(pluralize2(18, declensions)).toBe('zero-many');
			expect(pluralize2(19, declensions)).toBe('zero-many');
			expect(pluralize2(20, declensions)).toBe('zero-many');
			expect(pluralize2(21, declensions)).toBe('one');
		});
	});

	describe('split', () => {
		it('should return string if no substring passed', () => {
			const string = 'abc';
			const result = split(string, (void 0) as any);
			expect(result[0]).toBe(string);
		});

		it('should split by substring', () => {
			expect(split('abc', 'b')).toEqual(['a', 'b', 'c']);
		});

		it('should be case sensitive by default', () => {
			expect(split('abc', 'B')).toEqual(['abc']);
		});

		it('should accept caseSensitive flag', () => {
			expect(split('abc', 'B', false)).toEqual(['a', 'b', 'c']);
			expect(split('abc', 'B', true)).toEqual(['abc']);
		});

		it('should accept zero as substring', () => {
			expect(split('a0c', '0')).toEqual(['a', '0', 'c']);
		});

		it('should support special characters', () => {
			[
				'[',
				']',
				'{',
				'}',
				'(',
				')',
				'*',
				'+',
				'?',
				'!',
				'.',
				',',
				'\\',
				'/',
				'^',
				'$',
				'|',
				'#',
				'1 1', //spaces
				'1\t1', //tabs
				'1\n1',
				'1\r1',
			].forEach(char => expect(split(`a${char}`, char)).toEqual(['a', char, '']));
		});
	});
});