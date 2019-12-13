import debounce from '../debounce';
import throttle from '../throttle';
import memoize, { MEMOIZE_CLEAR_FUNCTION as _MEMOIZE_CLEAR_FUNCTION, memoOnce } from '../memoize';
import { eqUnknown } from '../../typeclasses/eq/eq.utils';

// symbols are not allowed as indexers in TS, had to cast to string. https://github.com/Microsoft/TypeScript/issues/24587#issuecomment-394022722
const MEMOIZE_CLEAR_FUNCTION = (_MEMOIZE_CLEAR_FUNCTION as unknown) as string;

describe('function', () => {
	describe('debounce', () => {
		it('should invoke decorated func after timeout', () => {
			const callback = jest.fn();
			const debounced = debounce(callback, 100);

			debounced();
			expect(callback).not.toBeCalled();

			jest.runAllTimers();
			expect(callback).toBeCalled();

			debounced();
			expect(callback.mock.calls.length).toBe(1);
		});
	});

	describe('throttle', () => {
		it('should invoke decorated func once during time interval', () => {
			const callback = jest.fn();
			const throttled = throttle(callback, 1000);

			throttled();
			expect(callback).toBeCalled();

			throttled();
			expect(callback.mock.calls.length).toBe(1);

			jest.runAllTimers();
			throttled();
			expect(callback.mock.calls.length).toBe(2);
		});
	});

	describe('memoize', () => {
		it("should memoize passed function for it's arguments", () => {
			const callback = jest.fn();
			const fn = memoize(function(a: number, b: number) {
				callback();
				return a + b;
			});
			expect(fn(1, 2)).toBe(3);
			expect(fn(1, 2)).toBe(3);
			expect(callback.mock.calls.length).toBe(1);
		});

		it('should throw on invalid arguments', () => {
			const fn = memoize(function() {
				//eslint-disable-line no-empty-function
			});
			expect(fn.bind(null, [])).toThrow();
			expect(fn.bind(null, {})).toThrow();
		});

		it('should inject clearer function', () => {
			const callback = jest.fn();
			const fn = memoize(function(a: number, b: number) {
				callback();
				return a + b;
			});
			expect(fn[MEMOIZE_CLEAR_FUNCTION]).toBeDefined();
			fn(1, 2);
			fn(1, 2);
			expect(callback.mock.calls.length).toBe(1);
			fn[MEMOIZE_CLEAR_FUNCTION](1, 2);
			fn(1, 2);
			fn(1, 2);
			expect(callback.mock.calls.length).toBe(2);
		});
	});

	describe('memoOnce', () => {
		it("should memoize once passed function for it's arguments", () => {
			const callback = jest.fn();
			const m = memoOnce(eqUnknown);
			const fn = m(function(a: number, b: number) {
				callback();
				return a + b;
			});
			expect(fn(1, 2)).toBe(3);
			expect(fn(1, 2)).toBe(3);
			expect(fn(1, 3)).toBe(4);
			expect(fn(1, 2)).toBe(3);
			expect(callback.mock.calls.length).toBe(3);
		});
	});
});
