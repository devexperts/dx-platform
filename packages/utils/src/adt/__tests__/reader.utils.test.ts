import { asks } from 'fp-ts/lib/Reader';
import { combine } from '../reader.utils';

type TFirst = {
	foo: number;
};

type TSecond = {
	bar: string;
};

describe('Reader utils', () => {
	it('should combine context of provided readers', () => {
		const first = asks((e: TFirst) => () => {});
		const second = asks((e: TSecond) => () => {});

		const combined = combine(first, second, (a, b, e) => {
			expect(e.bar).toBe('bar');
			expect(e.foo).toBe(2);
		});

		combined.run({
			foo: 2,
			bar: 'bar',
		});
	});

	it('should be possible to use each components with bundled context', () => {
		const fn = jest.fn();
		const first = asks((e: TFirst) => () => fn(e.foo));
		const second = asks((e: TSecond) => () => fn(e.bar));

		const combined = combine(first, second, (a, b, e) => {
			a();
			expect(fn).toHaveBeenCalledWith(2);
			b();
			expect(fn).toHaveBeenCalledWith('bar');
		});

		combined.run({
			foo: 2,
			bar: 'bar',
		});
	});
});
