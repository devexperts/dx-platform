import { is, deepEqual, shallowEqual, mapKeys } from '../object';

describe('object', () => {
	describe('mapKeys', () => {
		it('should return new object with keys mapped with template', () => {
			const testObject = {
				test: 'value',
				test2: 'value2'
			};
			const newObject = mapKeys(testObject, key => `data-${key}`);

			expect(newObject['data-test']).toEqual('value');
			expect(newObject['data-test2']).toEqual('value2');
		});
	});

	describe('is', () => {
		it('should compare objects', () => {
			/*eslint-disable no-undefined*/
			expect(is(undefined, undefined)).toBeTruthy();
			expect(is(undefined, 1)).toBeFalsy();
			expect(is(null, null)).toBeTruthy();
			expect(is(1, null)).toBeFalsy();
			expect(is(true, true)).toBeTruthy();
			expect(is(false, false)).toBeTruthy();
			expect(is(true, false)).toBeFalsy();
			expect(is('123', '123')).toBeTruthy();
			expect(is('foo', 'bar')).toBeFalsy();
			const a = {};
			expect(is(a, a)).toBeTruthy();
			expect(is(a, {})).toBeFalsy();
			expect(is(1, 1)).toBeTruthy();
			expect(is(-1, -1)).toBeTruthy();
			expect(is(NaN, NaN)).toBeTruthy();
			expect(is(+0, +0)).toBeTruthy();
			expect(is(-0, -0)).toBeTruthy();
			expect(is(0, -0)).toBeFalsy();
			expect(is(NaN, 0 / 0)).toBeTruthy(); //eslint-disable-line space-infix-ops
		});
	});

	describe('deepEqual', () => {
		it('should deeply compare objects', () => {
			expect(deepEqual({}, {})).toBeTruthy();
			expect(deepEqual({a: {foo: 1}}, {a: {foo: 1}})).toBeTruthy(); //eslint-disable-line
			expect(deepEqual({a: {foo: 1}}, {a: {foo: 2}})).toBeFalsy(); //eslint-disable-line
			expect(deepEqual({a: {foo: 1}}, {a: {bar: 1}})).toBeFalsy(); //eslint-disable-line
		});
	});
});