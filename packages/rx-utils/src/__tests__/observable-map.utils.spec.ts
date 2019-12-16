import { ObservableMap } from '../observable-map.utils';
import { TestScheduler } from 'rxjs/testing';
import { tap } from 'rxjs/operators';

describe('ObservableMap', () => {
	let scheduler: TestScheduler;
	let map: ObservableMap<string, string>;
	beforeEach(() => {
		scheduler = new TestScheduler((a, b) => expect(a).toEqual(b));
		map = new ObservableMap();
	});
	afterEach(() => {
		scheduler.flush();
	});

	describe('size', () => {
		it('should return 0 for empty map', () => {
			expect(map.size).toBe(0);
		});
		it('should return the size', () => {
			map.set('foo', 'bar');
			expect(map.size).toBe(1);
			map.set('foo', 'bar2');
			expect(map.size).toBe(1);
			map.set('bar', 'bar');
			expect(map.size).toBe(2);
		});
	});

	describe('isEmpty', () => {
		it('should be true for empty map', () => {
			expect(new ObservableMap().isEmpty).toBeTruthy();
		});
		it('should be false for non-empty map', () => {
			map.set('foo', 'bar');
			expect(map.isEmpty).toBeFalsy();
		});
	});

	describe('has', () => {
		beforeEach(() => {
			map.set('foo', 'bar');
		});

		it('should return false if value is absent', () => {
			expect(map.has('foo123')).toBeFalsy();
		});
		it('should return true if value exists', () => {
			expect(map.has('foo')).toBeTruthy();
		});
	});

	describe('keys$', () => {
		it('should emit lists of keys', () => {
			const scheme = {
				src: '^--1--2|',
				sub: '^------!',
				res: '0--1--2-',
			};
			const expected = {
				0: [],
				1: ['1'],
				2: ['1', '2'],
			};
			scheduler
				.createHotObservable<string>(scheme.src)
				.pipe(tap(value => map.set(value, value)))
				.subscribe();
			scheduler.expectObservable(map.keys$).toBe(scheme.res, expected);
		});

		it('should skip existing keys', () => {
			const scheme = {
				src: '^--1--2--3-|',
				sub: '^----------!',
				res: '0--1-----2--',
			};
			const values = {
				1: '1',
				2: '1',
				3: '2',
			};
			const expected = {
				0: [],
				1: ['1'],
				2: ['1', '2'],
			};
			scheduler
				.createHotObservable<string>(scheme.src, values)
				.pipe(tap(value => map.set(value, value)))
				.subscribe();
			scheduler.expectObservable(map.keys$).toBe(scheme.res, expected);
		});
	});

	describe('values$', () => {
		it('should emit lists of values', () => {
			const scheme = {
				src: '^--1--2|',
				sub: '^------!',
				res: '0--1--2-',
			};
			const expected = {
				0: [],
				1: ['1'],
				2: ['1', '2'],
			};
			scheduler
				.createHotObservable<string>(scheme.src)
				.pipe(tap(value => map.set(value, value)))
				.subscribe();
			scheduler.expectObservable(map.values$).toBe(scheme.res, expected);
		});
		it('should skip existing values', () => {
			const scheme = {
				src: '^--1--2--3|',
				sub: '^---------!',
				res: '0--1-----2-',
			};
			const values = {
				1: '1',
				2: '1',
				3: '2',
			};
			const expected = {
				0: [],
				1: ['1'],
				2: ['1', '2'],
			};
			scheduler
				.createHotObservable<string>(scheme.src, values)
				.pipe(tap(value => map.set(value, value)))
				.subscribe();
			scheduler.expectObservable(map.values$).toBe(scheme.res, expected);
		});
	});

	describe('entries$', () => {
		it('should emit entries', () => {
			const scheme = {
				src: '^--1--2|',
				sub: '^------!',
				res: '0--1--2-',
			};
			type Entity = {
				key: string;
				value: string;
			};
			const values = {
				1: {
					key: 'foo',
					value: 'fooValue',
				},
				2: {
					key: 'bar',
					value: 'barValue',
				},
			};
			const expected = {
				0: [],
				1: [[values[1].key, values[1].value]],
				2: [
					[values[1].key, values[1].value],
					[values[2].key, values[2].value],
				],
			};
			scheduler
				.createHotObservable<Entity>(scheme.src, values)
				.pipe(tap(value => map.set(value.key, value.value)))
				.subscribe();
			scheduler.expectObservable(map.entries$).toBe(scheme.res, expected);
		});
		it('should skip entries with existing values', () => {
			const scheme = {
				src: '^--1--1--2|',
				sub: '^---------!',
				res: '0--1-----2-',
			};
			type Entity = {
				key: string;
				value: string;
			};
			const values = {
				1: {
					key: 'foo',
					value: 'fooValue',
				},
				2: {
					key: 'bar',
					value: 'barValue',
				},
			};
			const expected = {
				0: [],
				1: [[values[1].key, values[1].value]],
				2: [
					[values[1].key, values[1].value],
					[values[2].key, values[2].value],
				],
			};
			scheduler
				.createHotObservable<Entity>(scheme.src, values)
				.pipe(tap(value => map.set(value.key, value.value)))
				.subscribe();
			scheduler.expectObservable(map.entries$).toBe(scheme.res, expected);
		});
	});
	describe('get', () => {
		it('should return cached observable', () => {
			const scheme1 = {
				src: '^-1--2--3-|',
				sub: '^---------!',
				res: '--1--2--3--',
				expected: {
					1: '1',
					2: '2',
					3: '3',
				},
			};
			const scheme2 = {
				src: '--1-^2--3-|',
				// @formatter:off
				//prettier-ignore
				sub:     '^-----!',
				//prettier-ignore
				res:     '12--3--',
				// @formatter:on
				expected: {
					1: '1',
					2: '2',
					3: '3',
				},
			};
			const scheme3 = {
				src: '--1--2-^3-|',
				// @formatter:off
				//prettier-ignore
				sub:        '^!--',
				//prettier-ignore
				res:        '2---',
				// @formatter:on
				expected: {
					2: '2',
				},
			};

			const o1 = map.get('1');
			const o2 = map.get('2');
			const o3 = map.get('3');
			scheduler
				.createHotObservable<string>(scheme1.src)
				.pipe(tap(value => map.set('1', value)))
				.subscribe();
			scheduler
				.createHotObservable<string>(scheme2.src)
				.pipe(tap(value => map.set('2', value)))
				.subscribe();
			scheduler
				.createHotObservable<string>(scheme3.src)
				.pipe(tap(value => map.set('3', value)))
				.subscribe();

			scheduler.expectObservable(o1, scheme1.sub).toBe(scheme1.res, scheme1.expected);
			scheduler.expectObservable(o2, scheme2.sub).toBe(scheme2.res, scheme2.expected);
			scheduler.expectObservable(o3, scheme3.sub).toBe(scheme3.res, scheme3.expected);
		});
	});
});
